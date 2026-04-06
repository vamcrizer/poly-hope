'use client';

import { useEffect, useState, useCallback } from 'react';

interface Signal {
  id: number;
  asset: string;
  direction: 'LONG' | 'SHORT';
  confidence: number;
  entry_price: number | null;
  stop_loss: number | null;
  take_profit: number | null;
  timeframe: string | null;
  generated_at: string;
}

const ASSETS = ['ALL', 'BTC', 'ETH', 'SOL', 'XRP', 'DOGE'];
const DIRECTIONS = ['ALL', 'LONG', 'SHORT'];

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-800">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-800 rounded animate-pulse" style={{ width: `${50 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

function fmt(val: number | null, prefix = '$') {
  if (val == null) return '—';
  return `${prefix}${val.toLocaleString(undefined, { maximumFractionDigits: 4 })}`;
}

export default function SignalHistoryPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [asset, setAsset] = useState('ALL');
  const [direction, setDirection] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async (p: number, a: string, d: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), asset: a, direction: d });
      const res = await fetch(`/api/signals/history?${params}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      const data = await res.json();
      setSignals(data.signals ?? []);
      setTotal(data.total ?? 0);
      setPage(data.page ?? 1);
      setPages(data.pages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(1, asset, direction); }, [asset, direction, fetch_]);

  function handleAsset(a: string) { setAsset(a); setPage(1); }
  function handleDirection(d: string) { setDirection(d); setPage(1); }
  function handlePage(p: number) { setPage(p); fetch_(p, asset, direction); }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Signal History</h1>
          <p className="text-gray-400 text-sm mt-1">
            {total > 0 ? `${total.toLocaleString()} signals` : 'All historical signals'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
          {ASSETS.map((a) => (
            <button
              key={a}
              onClick={() => handleAsset(a)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                asset === a
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
          {DIRECTIONS.map((d) => (
            <button
              key={d}
              onClick={() => handleDirection(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                direction === d
                  ? d === 'LONG' ? 'bg-emerald-500 text-white' : d === 'SHORT' ? 'bg-red-500 text-white' : 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['Date', 'Asset', 'Direction', 'Confidence', 'Entry', 'Stop Loss', 'Take Profit'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
              {!loading && signals.map((signal) => (
                <tr key={signal.id} className="border-b border-gray-800/60 last:border-0 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                    {new Date(signal.generated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    <span className="ml-1 text-gray-700">
                      {new Date(signal.generated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{signal.asset}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      signal.direction === 'LONG'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/15 text-red-400 border border-red-500/20'
                    }`}>
                      {signal.direction}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${signal.direction === 'LONG' ? 'bg-emerald-500' : 'bg-red-500'}`}
                          style={{ width: `${signal.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono">{Math.round(signal.confidence * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap font-mono text-xs">{fmt(signal.entry_price)}</td>
                  <td className="px-4 py-3 text-red-400 whitespace-nowrap font-mono text-xs">{fmt(signal.stop_loss)}</td>
                  <td className="px-4 py-3 text-emerald-400 whitespace-nowrap font-mono text-xs">{fmt(signal.take_profit)}</td>
                </tr>
              ))}
              {!loading && signals.length === 0 && !error && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-gray-500">
                    No signals found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => handlePage(page + 1)}
              disabled={page >= pages}
              className="px-3 py-1.5 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
