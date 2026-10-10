import { useState, useEffect, useCallback } from 'react';
import type { ActiveReservation } from '../types';
import { confirmReservation } from '../services/api';
import StatusMessage from './StatusMessage';

interface ReservationCardProps {
  reservation: ActiveReservation;
  onStatusChange: (
    reservationId: string,
    status: 'expired' | 'confirmed',
    confirmedAt?: string
  ) => void;
  onStockRefresh: () => void;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function useCountdown(expiresAt: string, isActive: boolean) {
  const getSecondsLeft = useCallback(() => {
    const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  }, [expiresAt]);

  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft);

  useEffect(() => {
    if (!isActive) return;
    setSecondsLeft(getSecondsLeft());
    const interval = setInterval(() => {
      const remaining = getSecondsLeft();
      setSecondsLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, isActive, getSecondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const isUrgent = secondsLeft > 0 && secondsLeft <= 60;
  const isExpired = secondsLeft <= 0;

  return { secondsLeft, formatted, isUrgent, isExpired };
}

export default function ReservationCard({
  reservation,
  onStatusChange,
  onStockRefresh,
}: ReservationCardProps) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const isActive = reservation.status === 'active';
  const isConfirmed = reservation.status === 'confirmed';
  const isExpired = reservation.status === 'expired';

  const { formatted, isUrgent, isExpired: countdownExpired } = useCountdown(
    reservation.expires_at,
    isActive
  );

  // Auto-expire when countdown hits zero
  useEffect(() => {
    if (isActive && countdownExpired) {
      onStatusChange(reservation.reservation_id, 'expired');
      onStockRefresh();
    }
  }, [isActive, countdownExpired, reservation.reservation_id, onStatusChange, onStockRefresh]);

  const handleConfirm = async () => {
    setConfirmError(null);
    setConfirmLoading(true);
    try {
      const result = await confirmReservation({ reservation_id: reservation.reservation_id });
      onStatusChange(reservation.reservation_id, 'confirmed', result.confirmed_at);
      onStockRefresh();
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : 'Confirmation failed.');
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="card flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl border ${
              isConfirmed
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : isExpired
                ? 'bg-slate-700/30 border-slate-700'
                : 'bg-amber-500/10 border-amber-500/20'
            }`}
          >
            <svg
              className={`w-5 h-5 ${
                isConfirmed ? 'text-emerald-400' : isExpired ? 'text-slate-500' : 'text-amber-400'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              {isConfirmed ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : isExpired ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Reservation</h2>
            <p className="text-xs font-mono text-slate-500">{reservation.reservation_id}</p>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={`badge ${
            isConfirmed
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              : isExpired
              ? 'bg-slate-700/50 text-slate-500 border border-slate-700'
              : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isConfirmed ? 'bg-emerald-400' : isExpired ? 'bg-slate-600' : 'bg-amber-400 animate-pulse'
            }`}
          />
          {isConfirmed ? 'Confirmed' : isExpired ? 'Expired' : 'Active'}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="stat-card">
          <span className="text-xl font-extrabold text-slate-100">{reservation.quantity}</span>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Quantity</span>
        </div>
        <div className="stat-card">
          <span className="text-xs font-mono text-slate-300 leading-relaxed">
            {formatDateTime(reservation.expires_at)}
          </span>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Expires At</span>
        </div>
      </div>

      {/* Countdown — only show when active */}
      {isActive && (
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
            isUrgent
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-slate-800/60 border-slate-700/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg
              className={`w-4 h-4 ${isUrgent ? 'text-red-400 animate-spin-slow' : 'text-slate-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-sm font-medium ${isUrgent ? 'text-red-300' : 'text-slate-400'}`}>
              Time remaining
            </span>
          </div>
          <span
            className={`text-2xl font-extrabold font-mono tracking-widest ${
              isUrgent ? 'text-red-400 countdown-urgent' : 'text-slate-100'
            }`}
          >
            {formatted}
          </span>
        </div>
      )}

      {/* Confirmed state */}
      {isConfirmed && reservation.confirmed_at && (
        <StatusMessage
          type="success"
          message={`Purchase confirmed on ${formatDateTime(reservation.confirmed_at)}`}
        />
      )}

      {/* Expired state */}
      {isExpired && (
        <StatusMessage type="warning" message="This reservation has expired. Please create a new one." />
      )}

      {/* Confirm error */}
      {confirmError && <StatusMessage type="error" message={confirmError} />}

      {/* Confirm button */}
      {isActive && (
        <button
          id="btn-confirm-reservation"
          onClick={handleConfirm}
          disabled={confirmLoading}
          className="btn-success w-full"
        >
          {confirmLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Confirming…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Confirm Purchase
            </>
          )}
        </button>
      )}
    </div>
  );
}
