'use client';

import { useEffect, useState } from 'react';

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

interface HistoryEntry {
  date: string;
  signals: Signal[];
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-800">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-800 rounded animate-pulse" style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function SignalHistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/signals/history');
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Request failed (${res.status})`);
        }
        const data = await res.json();
        setHistory(data.history ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Signal History</h1>
        <p className="text-gray-400 text-sm mt-1">Past 30 days of daily signals</p>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !error && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['Date', 'Asset', 'Direction', 'Confidence', 'Entry', 'Stop Loss', 'Take Profit', 'Timeframe'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && history.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white font-semibold text-base mb-1">No history yet</p>
          <p className="text-gray-500 text-sm">Signals will appear here once they&apos;ve been generated.</p>
        </div>
      )}

      {/* History grouped by date */}
      {!loading && !error && history.length > 0 && (
        <div className="space-y-8">
          {history.map((entry) => (
            <div key={entry.date}>
              {/* Date heading */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-semibold text-gray-300">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-xs text-gray-600 bg-gray-800 rounded-full px-2.5 py-0.5">
                  {entry.signals.length} signal{entry.signals.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Signals table */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        {['Asset', 'Direction', 'Confidence', 'Entry', 'Stop Loss', 'Take Profit', 'Timeframe'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-medium whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {entry.signals.map((signal) => (
                        <tr key={signal.id} className="border-b border-gray-800/60 last:border-0 hover:bg-gray-800/30 transition-colors">
                          {/* Asset */}
                          <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                            {signal.asset}
                          </td>

                          {/* Direction badge */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                signal.direction === 'LONG'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-red-500/15 text-red-400 border border-red-500/20'
                              }`}
                            >
                              {signal.direction}
                            </span>
                          </td>

                          {/* Confidence */}
                          <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                            {signal.confidence}%
                          </td>

                          {/* Entry */}
                          <td className="px-4 py-3 text-gray-300 whitespace-nowrap font-mono text-xs">
                            {signal.entry_price != null ? `$${signal.entry_price.toLocaleString()}` : '—'}
                          </td>

                          {/* Stop Loss */}
                          <td className="px-4 py-3 text-red-400 whitespace-nowrap font-mono text-xs">
                            {signal.stop_loss != null ? `$${signal.stop_loss.toLocaleString()}` : '—'}
                          </td>

                          {/* Take Profit */}
                          <td className="px-4 py-3 text-emerald-400 whitespace-nowrap font-mono text-xs">
                            {signal.take_profit != null ? `$${signal.take_profit.toLocaleString()}` : '—'}
                          </td>

                          {/* Timeframe */}
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                            {signal.timeframe ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
