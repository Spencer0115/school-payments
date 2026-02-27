from django.contrib import admin
from .models import Trip, Transaction


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ("name", "date", "cost", "location", "school_id")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("student_name", "parent_name", "amount", "status", "transaction_id", "created_at")
    list_filter = ("status",)
