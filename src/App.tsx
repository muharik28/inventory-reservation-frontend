import { useState, useEffect, useCallback } from 'react';
import StockPanel from './components/StockPanel';
import ReservationForm from './components/ReservationForm';
import ReservationCard from './components/ReservationCard';
import { fetchStock } from './services/api';
import type { StockResponse, ActiveReservation, ReserveResponse } from './types';

const ITEM_ID =  import.meta.env.VITE_ITEM_ID;

export default function App() {
  const [stock, setStock] = useState<StockResponse | null>(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  const [reservation, setReservation] = useState<ActiveReservation | null>(null);

  // Fetch stock from backend
  const loadStock = useCallback(async () => {
    setStockLoading(true);
    setStockError(null);
    try {
      const data = await fetchStock(ITEM_ID);
      setStock(data);
    } catch (err) {
      setStockError(err instanceof Error ? err.message : 'Failed to load stock.');
    } finally {
      setStockLoading(false);
    }
  }, []);

  // Auto-load stock on mount
  useEffect(() => {
    loadStock();
  }, [loadStock]);

  // Handle new reservation from the form
  const handleReserved = useCallback((result: ReserveResponse) => {
    setReservation({
      reservation_id: result.reservation_id,
      item_id: result.item_id,
      quantity: result.quantity,
      expires_at: result.expires_at,
      status: 'active',
    });
    loadStock(); // refresh stock after reserve
  }, [loadStock]);

  // Handle reservation status changes (expired / confirmed)
  const handleStatusChange = useCallback(
    (reservationId: string, status: 'expired' | 'confirmed', confirmedAt?: string) => {
      setReservation((prev) => {
        if (!prev || prev.reservation_id !== reservationId) return prev;
        return { ...prev, status, ...(confirmedAt ? { confirmed_at: confirmedAt } : {}) };
      });
    },
    []
  );

  // Disable the reservation form when there is an active (non-expired, non-confirmed) reservation
  const formDisabled =
    reservation !== null &&
    reservation.status !== 'expired' &&
    reservation.status !== 'confirmed';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-100 leading-tight">Inventory Reservation</h1>
              <p className="text-xs text-slate-500 leading-tight">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-500 font-medium">Connected</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Hero */}
        <div className="mb-8 text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Stock Management
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Reserve inventory items in real time. Reservations expire in 5 minutes — confirm before the timer runs out.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <StockPanel
              itemId={ITEM_ID}
              stock={stock}
              loading={stockLoading}
              error={stockError}
              onRefresh={loadStock}
            />
            <ReservationForm
              itemId={ITEM_ID}
              onReserved={handleReserved}
              disabled={formDisabled}
            />
          </div>

          {/* Right column — reservation details */}
          <div className="flex flex-col gap-6">
            {reservation ? (
              <ReservationCard
                reservation={reservation}
                onStatusChange={handleStatusChange}
                onStockRefresh={loadStock}
              />
            ) : (
              <div className="card flex flex-col items-center justify-center gap-4 py-16 text-center min-h-[280px]">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold">No active reservation</p>
                  <p className="text-slate-600 text-sm mt-1">Fill in the form to reserve stock.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 text-center">
        <p className="text-xs text-slate-600">
          Inventory Reservation Dashboard &mdash; connected to{' '}
          <span className="font-mono text-slate-500">localhost:8080</span>
        </p>
      </footer>
    </div>
  );
}
