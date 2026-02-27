const API_BASE = '/api';

/**
 * Fetch trip details by ID.
 */
export async function fetchTrip(tripId) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/`);
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to load trip details.');
    }
    return res.json();
}

/**
 * Submit a payment to the backend.
 */
export async function submitPayment(paymentData) {
    const res = await fetch(`${API_BASE}/payments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
        // Flatten DRF validation errors into a message string
        if (body.errors) {
            const msgs = Object.entries(body.errors)
                .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
                .join('; ');
            throw new Error(msgs);
        }
        throw new Error(body.error || 'Payment failed. Please try again.');
    }

    return body;
}
