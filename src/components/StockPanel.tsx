import type { StockResponse } from '../types';
import StatusMessage from './StatusMessage';

interface StockPanelProps {
  itemId: string;
  stock: StockResponse | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | null;
  color: string;
}) {
  return (
    <div className="stat-card">
      <span className={`text-2xl font-extrabold tracking-tight ${color}`}>
        {value === null ? '—' : value.toLocaleString()}
      </span>
      <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function StockPanel({ itemId, stock, loading, error, onRefresh }: StockPanelProps) {
  return (
    <div className="card flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Live Inventory</h2>
            <p className="text-xs text-slate-500 font-mono">{itemId}</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="btn-ghost text-xs gap-1.5"
          id="btn-refresh-stock"
          aria-label="Refresh stock"
        >
          <svg
            className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total Stock" value={stock?.total_stock ?? null} color="text-slate-100" />
        <StatCard label="Reserved" value={stock?.reserved_stock ?? null} color="text-amber-400" />
        <StatCard label="Available" value={stock?.available_stock ?? null} color="text-emerald-400" />
      </div>

      {/* Progress bar */}
      {stock && stock.total_stock > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Availability</span>
            <span className="font-semibold text-emerald-400">
              {Math.round((stock.available_stock / stock.total_stock) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${(stock.available_stock / stock.total_stock) * 100}%` }}
            />
          </div>
        </div>
      )}

      {error && <StatusMessage type="error" message={error} />}

      {!stock && !loading && !error && (
        <StatusMessage type="info" message="Click Refresh to load stock data." />
      )}
    </div>
  );
}
