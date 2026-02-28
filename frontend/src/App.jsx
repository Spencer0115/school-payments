import { useState, useEffect } from 'react';
import TripList from './components/TripList';
import TripDetails from './components/TripDetails';
import PaymentForm from './components/PaymentForm';
import Confirmation from './components/Confirmation';
import { fetchTrips, submitPayment } from './api/payments';

const STEPS = ['list', 'details', 'payment', 'confirmation'];

export default function App() {
  const [step, setStep] = useState('list');
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrips()
      .then(setTrips)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    setStep('details');
  };

  const handlePaymentSubmit = async (data) => {
    setPaymentLoading(true);
    setError('');
    try {
      const res = await submitPayment({ ...data, trip_id: selectedTrip.id });
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
    setStep('list');
    setSelectedTrip(null);
    setResult(null);
    setError('');
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="spinner-lg" />
          <p className="text-sm text-surface-700/60">Loading available trips…</p>
        </div>
      </Shell>
    );
  }

  /* ── Error loading trips ── */
  if (error && trips.length === 0) {
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

      {step === 'list' && (
        <TripList trips={trips} onSelect={handleTripSelect} />
      )}

      {step === 'details' && (
        <div>
          <button
            className="btn-secondary mb-4 text-sm"
            onClick={() => setStep('list')}
          >
            ← Back to List
          </button>
          <TripDetails trip={selectedTrip} onRegister={() => setStep('payment')} />
        </div>
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
            trip={selectedTrip}
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
