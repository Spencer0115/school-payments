/* eslint-disable react/prop-types */

export default function TripList({ trips, onSelect }) {
    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-surface-900 mb-6">Available Field Trips</h2>
            <div className="grid grid-cols-1 gap-4">
                {trips.map((trip) => (
                    <div
                        key={trip.id}
                        className="glass-card p-5 hover:border-primary-300 transition-colors cursor-pointer group"
                        onClick={() => onSelect(trip)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-surface-900 group-hover:text-primary-600 transition-colors">
                                {trip.name}
                            </h3>
                            <span className="text-primary-600 font-bold">
                                ${Number(trip.cost).toFixed(2)}
                            </span>
                        </div>
                        <p className="text-sm text-surface-700 line-clamp-2 mb-4">
                            {trip.description}
                        </p>
                        <div className="flex items-center justify-between text-xs font-medium text-surface-700/60 uppercase tracking-wider">
                            <div className="flex items-center gap-1.5">
                                <span>📅</span>
                                <span>{new Date(trip.date).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span>📍</span>
                                <span className="truncate max-w-[150px]">{trip.location}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
