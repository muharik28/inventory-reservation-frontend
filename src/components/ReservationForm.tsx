import { useState } from 'react';
import type { ReserveResponse } from '../types';
import { reserveItem } from '../services/api';
import StatusMessage from './StatusMessage';

interface ReservationFormProps {
  itemId: string;
  onReserved: (reservation: ReserveResponse) => void;
  disabled: boolean;
}

export default function ReservationForm({ itemId, onReserved, disabled }: ReservationFormProps) {
  const [userId, setUserId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const qty = parseInt(quantity, 10);
    if (!userId.trim()) {
      setError('User ID is required.');
      return;
    }
    if (!quantity || isNaN(qty) || qty <= 0) {
      setError('Quantity must be a positive number.');
      return;
    }

    setLoading(true);
    try {
      const result = await reserveItem({
        item_id: itemId,
        quantity: qty,
        user_id: userId.trim(),
      });
      onReserved(result);
      setUserId('');
      setQuantity('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reservation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100">Make a Reservation</h2>
          <p className="text-xs text-slate-500">Reserves hold for 5 minutes</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {/* Item ID (read-only) */}
        <div>
          <label className="label" htmlFor="field-item-id">Item ID</label>
          <input
            id="field-item-id"
            type="text"
            value={itemId}
            readOnly
            className="input opacity-60 cursor-not-allowed"
            aria-readonly="true"
          />
        </div>

        {/* User ID */}
        <div>
          <label className="label" htmlFor="field-user-id">User ID</label>
          <input
            id="field-user-id"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g. usr_9981"
            className="input"
            disabled={loading || disabled}
            autoComplete="off"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="label" htmlFor="field-quantity">Quantity</label>
          <input
            id="field-quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 2"
            min={1}
            className="input"
            disabled={loading || disabled}
          />
        </div>

        {error && <StatusMessage type="error" message={error} />}

        <button
          id="btn-reserve"
          type="submit"
          className="btn-primary w-full mt-1"
          disabled={loading || disabled}
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Reserving…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Reserve Stock
            </>
          )}
        </button>
      </form>
    </div>
  );
}
