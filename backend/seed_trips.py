import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_payments.settings')
django.setup()

from payments.models import Trip

def seed():
    trips = [
        {
            "name": "Arataki Science Centre",
            "description": "Exploration of marine life and interactive science exhibits. Students will participate in hands-on experiments and a guided tour of the facility.",
            "date": "2026-04-12",
            "cost": 35.00,
            "location": "Arataki, Auckland",
            "school_id": "SCH-001",
            "activity_id": "ACT-102"
        },
        {
            "name": "Wellington Zoo Safari",
            "description": "A day among animals from across the globe. Includes a private workshop with zookeepers focused on conservation and animal habitats.",
            "date": "2026-05-20",
            "cost": 45.50,
            "location": "Newtown, Wellington",
            "school_id": "SCH-001",
            "activity_id": "ACT-203"
        },
        {
            "name": "Art Gallery Workshop",
            "description": "A creative day exploring modern and traditional art. The session includes a practical workshop led by a professional artist to develop student techniques.",
            "date": "2026-06-05",
            "cost": 22.00,
            "location": "City Centre, Christchurch",
            "school_id": "SCH-001",
            "activity_id": "ACT-304"
        }
    ]

    for t_data in trips:
        trip, created = Trip.objects.get_or_create(
            name=t_data["name"],
            defaults=t_data
        )
        if created:
            print(f"Created trip: {trip.name}")
        else:
            print(f"Trip already exists: {trip.name}")

if __name__ == "__main__":
    seed()
