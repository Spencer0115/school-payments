from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch
from .models import Trip, Transaction
from .legacy_processor import PaymentResponse

class TripDetailTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.trip = Trip.objects.create(
            name="Museum Trip",
            description="Visit to the museum",
            date="2026-05-15",
            cost=25.00,
            location="City Museum",
            school_id="SCH-001",
            activity_id="ACT-101"
        )

    def test_get_trip_success(self):
        """Verify fetching valid trip details."""
        url = reverse("trip-detail", kwargs={"trip_id": self.trip.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Museum Trip")
        self.assertEqual(float(response.data["cost"]), 25.00)

    def test_get_trip_not_found(self):
        """Verify 404 for invalid trip ID."""
        url = reverse("trip-detail", kwargs={"trip_id": 999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"], "Trip not found.")

class PaymentProcessTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.trip = Trip.objects.create(
            name="Camping Trip",
            description="Outdoor camping",
            date="2026-06-20",
            cost=150.00,
            location="National Park",
            school_id="SCH-001",
            activity_id="ACT-202"
        )
        self.valid_payload = {
            "trip_id": self.trip.id,
            "student_name": "John Doe",
            "parent_name": "Jane Doe",
            "card_number": "1234 5678 1234 5678",
            "expiry_date": "12/26",
            "cvv": "123"
        }

    @patch("payments.views.processor.process_payment")
    def test_payment_success(self, mock_process):
        """Verify successful payment flow and record storage."""
        mock_process.return_value = PaymentResponse(success=True, transaction_id="TX-12345")
        
        url = reverse("process-payment")
        response = self.client.post(url, self.valid_payload, content_type="application/json")
        
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["transaction_id"], "TX-12345")
        
        # Check database
        transaction = Transaction.objects.get(transaction_id="TX-12345")
        self.assertEqual(transaction.status, Transaction.Status.SUCCESS)
        self.assertEqual(transaction.student_name, "John Doe")
        self.assertEqual(transaction.card_last_four, "5678")

    @patch("payments.views.processor.process_payment")
    def test_payment_decline(self, mock_process):
        """Verify declined payment flow and error storage."""
        mock_process.return_value = PaymentResponse(success=False, error_message="Insufficient funds")
        
        url = reverse("process-payment")
        response = self.client.post(url, self.valid_payload, content_type="application/json")
        
        self.assertEqual(response.status_code, 402)
        self.assertFalse(response.data["success"])
        self.assertEqual(response.data["error"], "Insufficient funds")
        
        # Check database
        transaction = Transaction.objects.last()
        self.assertEqual(transaction.status, Transaction.Status.FAILED)
        self.assertEqual(transaction.error_message, "Insufficient funds")

    def test_invalid_validation(self):
        """Verify serializer validation (e.g. short card number)."""
        payload = self.valid_payload.copy()
        payload["card_number"] = "123" # Invalid
        
        url = reverse("process-payment")
        response = self.client.post(url, payload, content_type="application/json")
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("card_number", response.data["errors"])
