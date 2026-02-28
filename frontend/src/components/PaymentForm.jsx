/* eslint-disable react/prop-types */
import { useState } from 'react';

const INITIAL = {
    student_name: '',
    parent_name: '',
    card_number: '',
    expiry_date: '',
    cvv: '',
};

export default function PaymentForm({ trip, onSubmit, isLoading }) {
    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Auto-format card number with spaces every 4 digits
        if (name === 'card_number') {
            value = value.replace(/\D/g, '').slice(0, 16);
            value = value.replace(/(.{4})/g, '$1 ').trim();
        }

        // Auto-format expiry MM/YY
        if (name === 'expiry_date') {
            value = value.replace(/\D/g, '').slice(0, 4);
            if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
        }

        // CVV — digits only, max 3
        if (name === 'cvv') {
            value = value.replace(/\D/g, '').slice(0, 3);
        }

        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!form.student_name.trim()) errs.student_name = 'Student name is required.';
        else if (form.student_name.length > 200) errs.student_name = 'Student name cannot exceed 200 characters.';

        if (!form.parent_name.trim()) errs.parent_name = 'Parent / guardian name is required.';
        else if (form.parent_name.length > 200) errs.parent_name = 'Parent name cannot exceed 200 characters.';
        const cardClean = form.card_number.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cardClean)) errs.card_number = 'Enter a valid 16-digit card number.';
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry_date))
            errs.expiry_date = 'Use MM/YY format.';
        if (!/^\d{3}$/.test(form.cvv)) errs.cvv = 'Enter a 3-digit CVV.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit({
            trip_id: trip.id,
            student_name: form.student_name.trim(),
            parent_name: form.parent_name.trim(),
            card_number: form.card_number.replace(/\s/g, ''),
            expiry_date: form.expiry_date,
            cvv: form.cvv,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in space-y-5" noValidate>
            <h2 className="text-xl font-bold text-surface-900">Registration &amp; Payment</h2>

            <p className="text-sm text-surface-700">
                You&apos;re registering for <strong>{trip.name}</strong> — <strong>${Number(trip.cost).toFixed(2)}</strong>
            </p>

            {/* ── Child / Parent fields ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                    label="Student Name"
                    name="student_name"
                    placeholder="e.g. Emma Johnson"
                    value={form.student_name}
                    onChange={handleChange}
                    error={errors.student_name}
                    maxLength={200}
                />
                <Field
                    label="Parent / Guardian Name"
                    name="parent_name"
                    placeholder="e.g. Sarah Johnson"
                    value={form.parent_name}
                    onChange={handleChange}
                    error={errors.parent_name}
                    maxLength={200}
                />
            </div>

            {/* ── Separator ── */}
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-surface-200" />
                <span className="text-xs font-medium text-surface-700/50 uppercase tracking-wider">
                    Card Details
                </span>
                <div className="h-px flex-1 bg-surface-200" />
            </div>

            {/* ── Card fields ── */}
            <Field
                label="Card Number"
                name="card_number"
                placeholder="1234 5678 9012 3456"
                value={form.card_number}
                onChange={handleChange}
                error={errors.card_number}
                inputMode="numeric"
            />
            <div className="grid grid-cols-2 gap-4">
                <Field
                    label="Expiry Date"
                    name="expiry_date"
                    placeholder="MM/YY"
                    value={form.expiry_date}
                    onChange={handleChange}
                    error={errors.expiry_date}
                    inputMode="numeric"
                />
                <Field
                    label="CVV"
                    name="cvv"
                    placeholder="123"
                    value={form.cvv}
                    onChange={handleChange}
                    error={errors.cvv}
                    inputMode="numeric"
                    type="password"
                />
            </div>

            <button
                id="submit-payment"
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <span className="spinner" />
                        Processing…
                    </>
                ) : (
                    `Pay $${Number(trip.cost).toFixed(2)}`
                )}
            </button>
        </form>
    );
}

/* ── Reusable field ── */
function Field({ label, name, error, ...rest }) {
    return (
        <div>
            <label htmlFor={name} className="form-label">
                {label}
            </label>
            <input
                id={name}
                name={name}
                className={`form-input ${error ? 'error' : ''}`}
                autoComplete="off"
                {...rest}
            />
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}
