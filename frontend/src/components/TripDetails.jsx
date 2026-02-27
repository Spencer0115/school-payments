/* eslint-disable react/prop-types */

export default function TripDetails({ trip, onRegister }) {
    const formattedDate = new Date(trip.date + 'T00:00:00').toLocaleDateString('en-NZ', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="animate-fade-in">
            {/* Hero badge */}
            <div className="flex items-center gap-2 mb-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-600 tracking-wide uppercase">
                    Upcoming Trip
                </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-2">
                {trip.name}
            </h2>

            <p className="text-surface-700 leading-relaxed mb-6">{trip.description}</p>

            {/* Info chips */}
            <div className="grid grid-cols-1 gap-3 mb-8">
                <InfoChip icon="📅" label="Date" value={formattedDate} />
                <InfoChip icon="📍" label="Location" value={trip.location} />
                <InfoChip
                    icon="💰"
                    label="Cost"
                    value={`$${Number(trip.cost).toFixed(2)}`}
                    highlight
                />
            </div>

            <button
                id="register-button"
                className="btn-primary w-full"
                onClick={onRegister}
            >
                Register &amp; Pay&nbsp;&nbsp;→
            </button>
        </div>
    );
}

function InfoChip({ icon, label, value, highlight }) {
    return (
        <div
            className={`flex items-start gap-3 rounded-xl p-3.5 ${highlight
                ? 'bg-accent-500/10 border border-accent-400/30'
                : 'bg-surface-100/60 border border-surface-200/50'
                }`}
        >
            <span className="text-xl mt-0.5">{icon}</span>
            <div>
                <span className="block text-xs font-medium text-surface-700/70 uppercase tracking-wider">
                    {label}
                </span>
                <span
                    className={`block text-sm font-semibold mt-0.5 ${highlight ? 'text-accent-500' : 'text-surface-800'
                        }`}
                >
                    {value}
                </span>
            </div>
        </div>
    );
}
