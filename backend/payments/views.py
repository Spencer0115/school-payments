import logging

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Trip, Transaction
from .serializers import TripSerializer, PaymentSubmissionSerializer, TransactionSerializer
from .legacy_processor import LegacyPaymentProcessor

logger = logging.getLogger(__name__)
processor = LegacyPaymentProcessor()


@api_view(["GET"])
def trip_list(request):
    """Fetch all available trips."""
    trips = Trip.objects.all().order_by("-date")
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def trip_detail(request, trip_id):
    """Fetch details for a specific trip."""
    try:
        trip = Trip.objects.get(pk=trip_id)
    except Trip.DoesNotExist:
        return Response({"error": "Trip not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = TripSerializer(trip)
    return Response(serializer.data)


@api_view(["POST"])
def process_payment(request):
    """
    Accept a payment submission, validate it, call the legacy processor,
    and store the transaction result.
    """
    serializer = PaymentSubmissionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    trip = Trip.objects.get(pk=data["trip_id"])

    # Create a pending transaction record
    transaction = Transaction.objects.create(
        trip=trip,
        student_name=data["student_name"],
        parent_name=data["parent_name"],
        amount=trip.cost,
        card_last_four=data["card_number"][-4:],
        status=Transaction.Status.PENDING,
    )

    # Build payload for the legacy processor
    payment_payload = {
        "student_name": data["student_name"],
        "parent_name": data["parent_name"],
        "amount": float(trip.cost),
        "card_number": data["card_number"],
        "expiry_date": data["expiry_date"],
        "cvv": data["cvv"],
        "school_id": trip.school_id,
        "activity_id": trip.activity_id,
    }

    # Call legacy payment API
    try:
        result = processor.process_payment(payment_payload)
    except Exception as e:
        logger.error("Legacy payment processor error: %s", e)
        transaction.status = Transaction.Status.FAILED
        transaction.error_message = "Payment processing service unavailable."
        transaction.save()
        return Response(
            {"error": "Payment processing service unavailable. Please try again later."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    # Update transaction based on result
    if result.success:
        transaction.status = Transaction.Status.SUCCESS
        transaction.transaction_id = result.transaction_id
        transaction.save()
        logger.info("Payment succeeded: %s", result.transaction_id)
        return Response(
            {
                "success": True,
                "transaction_id": result.transaction_id,
                "message": "Payment processed successfully!",
                "transaction": TransactionSerializer(transaction).data,
            },
            status=status.HTTP_201_CREATED,
        )
    else:
        transaction.status = Transaction.Status.FAILED
        transaction.error_message = result.error_message
        transaction.save()
        logger.warning("Payment failed: %s", result.error_message)
        return Response(
            {"success": False, "error": result.error_message},
            status=status.HTTP_402_PAYMENT_REQUIRED,
        )
