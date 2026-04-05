'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SignalPreview {
  asset: string;
  direction: 'LONG' | 'SHORT';
  timeframe: string;
  timestamp: string;
}

export default function EmbedWidgetPage() {
  const [signals, setSignals] = useState<SignalPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>('');

  useEffect(() => {
    fetch('/api/public/signal-preview')
      .then((r) => {
        if (!r.ok) throw new Error('fetch failed');
        return r.json() as Promise<SignalPreview[]>;
      })
      .then((data) => {
        setSignals(data.slice(0, 5));
        if (data[0]) {
          const d = new Date(data[0].timestamp);
          setUpdatedAt(
            d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          );
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const appUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : '';

  return (
    <div
      style={{ width: '300px', fontFamily: 'system-ui, sans-serif' }}
      className="bg-[#0a0a0f] border border-gray-800 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400 text-base">⚡</span>
          <span className="text-white text-sm font-semibold">Polymarket Signals</span>
        </div>
        {!loading && !error && updatedAt && (
          <span className="text-gray-500 text-xs">Updated {updatedAt}</span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {loading && (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between animate-pulse"
              >
                <div className="h-3.5 w-10 bg-gray-800 rounded" />
                <div className="h-5 w-14 bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-gray-500 text-xs text-center py-2">
            Unable to load signals.
          </p>
        )}

        {!loading && !error && signals.length === 0 && (
          <p className="text-gray-500 text-xs text-center py-2">
            No signals available.
          </p>
        )}

        {!loading && !error && signals.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-gray-500 text-xs font-medium pb-2">Asset</th>
                <th className="text-right text-gray-500 text-xs font-medium pb-2">Direction</th>
                <th className="text-right text-gray-500 text-xs font-medium pb-2">TF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {signals.map((s) => (
                <tr key={s.asset}>
                  <td className="py-1.5 text-white font-semibold text-xs">{s.asset}</td>
                  <td className="py-1.5 text-right">
                    <span
                      className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                        s.direction === 'LONG'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {s.direction}
                    </span>
                  </td>
                  <td className="py-1.5 text-right text-gray-500 text-xs">{s.timeframe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CTA Footer */}
      <div className="px-4 pb-3">
        <div className="border-t border-gray-800 pt-3">
          <div className="text-xs text-gray-500 mb-2">
            Price targets &amp; stop-loss hidden
          </div>
          <Link
            href={`${appUrl}/pricing`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold py-2 rounded-lg transition-colors"
          >
            Get full signals →
          </Link>
        </div>
      </div>
    </div>
  );
}
