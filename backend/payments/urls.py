from django.urls import path
from . import views

urlpatterns = [
    path("trips/<int:trip_id>/", views.trip_detail, name="trip-detail"),
    path("payments/", views.process_payment, name="process-payment"),
]
