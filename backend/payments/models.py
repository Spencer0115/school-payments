from django.db import models


class Trip(models.Model):
    """A school field trip that parents can register and pay for."""

    name = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    cost = models.DecimalField(max_digits=8, decimal_places=2)
    location = models.CharField(max_length=300)
    school_id = models.CharField(max_length=50)
    activity_id = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} — {self.date}"


class Transaction(models.Model):
    """A payment transaction record linked to a trip."""

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SUCCESS = "success", "Success"
        FAILED = "failed", "Failed"

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="transactions")
    student_name = models.CharField(max_length=200)
    parent_name = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    card_last_four = models.CharField(max_length=4)
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.PENDING
    )
    transaction_id = models.CharField(max_length=50, blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_name} — ${self.amount} — {self.status}"
