import re
from rest_framework import serializers
from .models import Trip, Transaction


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = ["id", "name", "description", "date", "cost", "location", "school_id", "activity_id"]


class PaymentSubmissionSerializer(serializers.Serializer):
    """Validates incoming payment data before passing to the legacy processor."""

    trip_id = serializers.IntegerField()
    student_name = serializers.CharField(max_length=200)
    parent_name = serializers.CharField(max_length=200)
    card_number = serializers.CharField(max_length=19)  # 16 digits + possible spaces
    expiry_date = serializers.CharField(max_length=5)
    cvv = serializers.CharField(max_length=3)

    def validate_card_number(self, value):
        cleaned = value.replace(" ", "")
        if not cleaned.isdigit() or len(cleaned) != 16:
            raise serializers.ValidationError("Card number must be 16 digits.")
        return cleaned

    def validate_expiry_date(self, value):
        if not re.match(r"^(0[1-9]|1[0-2])/\d{2}$", value):
            raise serializers.ValidationError("Expiry date must be in MM/YY format.")
        return value

    def validate_cvv(self, value):
        if not value.isdigit() or len(value) != 3:
            raise serializers.ValidationError("CVV must be 3 digits.")
        return value

    def validate_trip_id(self, value):
        if not Trip.objects.filter(id=value).exists():
            raise serializers.ValidationError("Trip not found.")
        return value


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id",
            "trip",
            "student_name",
            "parent_name",
            "amount",
            "card_last_four",
            "status",
            "transaction_id",
            "error_message",
            "created_at",
        ]
