# 🎓 School Payments

A full-stack web app for collecting school field trip payments. Parents can view trip details, register their child, and pay online.

## Tech Stack

| Layer     | Technology                               |
|-----------|------------------------------------------|
| Backend   | Python 3.12, Django 6, Django REST Framework |
| Frontend  | React 19 (Vite 7), Tailwind CSS v4       |
| Database  | SQLite                                   |
| Payment   | Legacy payment processor (simulated API) |

## Quick Start

### Prerequisites
- Python 3.12+
- [Pipenv](https://pipenv.pypa.io/) — install with `pip install pipenv`
- Node.js 18+

### 1. Backend

```bash
cd backend
pipenv install
pipenv run python manage.py migrate
pipenv run python manage.py shell -c "
from payments.models import Trip
from datetime import date
Trip.objects.get_or_create(
    school_id='SCHOOL-001',
    activity_id='TRIP-2026-001',
    defaults=dict(
        name='Wellington Zoo Adventure',
        description='Join us for an exciting day at Wellington Zoo! Students will explore native wildlife exhibits, attend a conservation workshop, and enjoy lunch at the picnic area.',
        date=date(2026, 4, 15),
        cost=45.00,
        location='200 Daniell Street, Newtown, Wellington',
    ),
)
"
pipenv run python manage.py runserver 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.
  
## 🛠️ Management & Administration

### Django Admin
The backend includes a pre-configured admin portal to manage trips and view transaction history.

1. **Create a Superuser**:
   ```bash
   cd backend
   pipenv run python manage.py createsuperuser
   ```
2. **Access Admin**: 
   Navigate to **http://127.0.0.1:8000/admin/** and log in.
3. **Features**:
   - Manage Field Trips (Add/Edit/Delete).
   - View Audit Trail (See all successful and failed payment attempts).

## 🧪 Testing

### Backend Unit Tests
Verified with 5 test cases covering endpoints, validation, and database storage.
```bash
cd backend
pipenv run python manage.py test payments
```

### Failure Simulation (Stress Test)
A specialized script that performs 20 payment attempts to demonstrate the 10% legacy failure rate.
```bash
# Ensure server is running at :8000
cd backend
pipenv run python stress_test.py
```

## Architecture

```
school-payments/
├── backend/             # Django REST API
│   ├── payments/
│   │   ├── models.py         # Trip, Transaction models
│   │   ├── serializers.py    # DRF serializers + validation
│   │   ├── views.py          # trip_detail, process_payment
│   │   ├── legacy_processor.py  # Provided legacy API
│   │   └── urls.py
│   └── school_payments/      # Django settings & root URLs
├── frontend/            # React + Vite
│   └── src/
│       ├── App.jsx           # 3-step flow orchestrator
│       ├── components/
│       │   ├── TripDetails.jsx
│       │   ├── PaymentForm.jsx
│       │   └── Confirmation.jsx
│       └── api/payments.js   # API helper
└── README.md
```

### API Endpoints

| Method | Path                | Description              |
|--------|---------------------|--------------------------|
| GET    | `/api/trips/<id>/`  | Fetch trip details       |
| POST   | `/api/payments/`    | Submit & process payment |

### User Flow

1. **Trip Details** → View trip info → Click "Register & Pay"
2. **Registration & Payment** → Enter student/parent names + card details → Submit
3. **Confirmation** → Success receipt with transaction ID, or error with retry

## Design Decisions

- **Glassmorphism UI** — Frosted-glass card, subtle gradients, and micro-animations give a premium feel.
- **Auto-formatting** — Card number (groups of 4), expiry (auto `/` insertion), and CVV are auto-formatted as the user types.
- **Dual validation** — Client-side validation for instant feedback; DRF serializer validation server-side as a safety net.
- **Transaction records** — Every payment attempt is stored with status (pending → success/failed), providing an audit trail.
- **Error resilience** — Legacy processor exceptions are caught and returned as 503; random 10% failures are presented as retriable errors.
- **Vite proxy** — Frontend proxies `/api` requests to Django in development, avoiding CORS complexity.

## 🤖 AI Assistance

This project was built with the help of AI, which played a major role in its development:
- **Scaffolding**: Fully scaffolded the backend (Django) and frontend (React/Vite) project structures from scratch.
- **Planning**: Generated comprehensive technical implementation plans and task lists for every feature.
- **Implementation**: Wrote all core code including models, views, API integration, and the modern UI.
- **Verification**: Built and executed automated unit tests and stress tests to ensure system reliability.


