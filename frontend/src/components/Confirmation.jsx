/* eslint-disable react/prop-types */

export default function Confirmation({ result, onReset }) {
    const isSuccess = result?.success;

    return (
        <div className="animate-fade-in text-center py-4">
            {/* Icon */}
            <div
                className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full text-3xl mb-4 ${isSuccess
                    ? 'bg-success-500/15 text-success-500'
                    : 'bg-danger-500/15 text-danger-500'
                    }`}
            >
                {isSuccess ? '✓' : '✗'}
            </div>

            <h2 className="text-xl font-bold text-surface-900 mb-2">
                {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
            </h2>

            {isSuccess ? (
                <>
                    <p className="text-surface-700 mb-4">{result.message}</p>

                    {/* Receipt card */}
                    <div className="text-left bg-surface-100/80 rounded-xl p-4 mb-6 space-y-2 text-sm border border-surface-200/60">
                        <Row label="Transaction ID" value={result.transaction_id} mono />
                        <Row label="Student" value={result.transaction?.student_name} />
                        <Row label="Parent" value={result.transaction?.parent_name} />
                        <Row label="Amount" value={`$${Number(result.transaction?.amount).toFixed(2)}`} />
                        <Row label="Card" value={`•••• ${result.transaction?.card_last_four}`} />
                        <Row
                            label="Date"
                            value={new Date(result.transaction?.created_at).toLocaleString('en-NZ')}
                        />
                    </div>
                </>
            ) : (
                <p className="text-surface-700 mb-6">{result?.error || 'An unknown error occurred.'}</p>
            )}

            <button
                id="back-to-trip"
                className={isSuccess ? 'btn-secondary' : 'btn-primary'}
                onClick={onReset}
            >
                {isSuccess ? '← Back to Trip Details' : 'Try Again'}
            </button>
        </div>
    );
}

function Row({ label, value, mono }) {
    return (
        <div className="flex justify-between gap-4 py-1">
            <span className="text-surface-700/70 flex-shrink-0">{label}</span>
            <span className={`font-medium text-surface-800 break-words text-right ${mono ? 'font-mono text-xs mt-0.5' : ''}`}>
                {value || '—'}
            </span>
        </div>
    );
}
