import { useState, useEffect } from 'react';
import TripDetails from './components/TripDetails';
import PaymentForm from './components/PaymentForm';
import Confirmation from './components/Confirmation';
import { fetchTrip, submitPayment } from './api/payments';

const TRIP_ID = 1; // Seeded trip
const STEPS = ['details', 'payment', 'confirmation'];

export default function App() {
  const [step, setStep] = useState('details');
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrip(TRIP_ID)
      .then(setTrip)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handlePaymentSubmit = async (data) => {
    setPaymentLoading(true);
    setError('');
    try {
      const res = await submitPayment(data);
      setResult(res);
      setStep('confirmation');
    } catch (err) {
      setResult({ success: false, error: err.message });
      setStep('confirmation');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleReset = () => {
    setStep('details');
    setResult(null);
    setError('');
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="spinner-lg" />
          <p className="text-sm text-surface-700/60">Loading trip details…</p>
        </div>
      </Shell>
    );
  }

  /* ── Error loading trip ── */
  if (error && !trip) {
    return (
      <Shell>
        <div className="text-center py-16">
          <p className="text-danger-500 font-medium mb-4">{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={`step-dot ${s === step ? 'active' : STEPS.indexOf(step) > i ? 'completed' : ''
              }`}
          />
        ))}
      </div>

      {/* Global API error banner */}
      {error && step === 'payment' && (
        <div className="mb-4 p-3 rounded-lg bg-danger-500/10 text-danger-500 text-sm font-medium border border-danger-500/20">
          {error}
        </div>
      )}

      {step === 'details' && (
        <TripDetails trip={trip} onRegister={() => setStep('payment')} />
      )}

      {step === 'payment' && (
        <div>
          <button
            className="btn-secondary mb-4 text-sm"
            onClick={() => setStep('details')}
          >
            ← Back
          </button>
          <PaymentForm
            trip={trip}
            onSubmit={handlePaymentSubmit}
            isLoading={paymentLoading}
          />
        </div>
      )}

      {step === 'confirmation' && (
        <Confirmation result={result} onReset={handleReset} />
      )}
    </Shell>
  );
}

/* ── Shell layout ── */
function Shell({ children }) {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex items-center gap-3">
        <span className="text-2xl">🎓</span>
        <span className="font-bold text-surface-900 text-lg tracking-tight">School Payments</span>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-4 pb-12 pt-4 sm:pt-8">
        <div className="glass-card w-full max-w-xl p-6 sm:p-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-surface-700/40">
        © 2026 Kindo · School Payments
      </footer>
    </div>
  );
}
