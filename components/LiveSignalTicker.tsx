'use client';

import { useEffect, useState } from 'react';

interface SignalPreview {
  asset: string;
  direction: 'LONG' | 'SHORT';
  timeframe: string;
  timestamp: string;
}

const FALLBACK: SignalPreview[] = [
  { asset: 'BTC', direction: 'LONG', timeframe: '15m', timestamp: new Date().toISOString() },
  { asset: 'ETH', direction: 'LONG', timeframe: '10m', timestamp: new Date().toISOString() },
  { asset: 'SOL', direction: 'SHORT', timeframe: '15m', timestamp: new Date().toISOString() },
  { asset: 'XRP', direction: 'LONG', timeframe: '15m', timestamp: new Date().toISOString() },
  { asset: 'DOGE', direction: 'SHORT', timeframe: '10m', timestamp: new Date().toISOString() },
];

const ASSET_COLORS: Record<string, string> = {
  BTC: 'text-orange-400',
  ETH: 'text-blue-400',
  SOL: 'text-purple-400',
  XRP: 'text-cyan-400',
  DOGE: 'text-yellow-400',
};

export function LiveSignalTicker() {
  const [signals, setSignals] = useState<SignalPreview[]>(FALLBACK);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetch('/api/public/signal-preview')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: SignalPreview[] | null) => {
        if (data && data.length > 0) {
          setSignals(data.slice(0, 5));
          if (data[0]?.timestamp) {
            const d = new Date(data[0].timestamp);
            setLastUpdated(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC');
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-gray-400">Live Signals</span>
        </div>
        {lastUpdated && (
          <span className="text-xs text-gray-600">Updated {lastUpdated}</span>
        )}
      </div>

      {/* Signal rows */}
      <div className="divide-y divide-gray-800/40">
        {signals.map((signal, i) => {
          const isLong = signal.direction === 'LONG';
          return (
            <div key={signal.asset} className="flex items-center justify-between px-4 py-3 hover:bg-gray-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold w-10 ${ASSET_COLORS[signal.asset] ?? 'text-gray-300'}`}>
                  {signal.asset}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${isLong ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                  {isLong ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  {signal.direction}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 font-mono">{signal.timeframe}</span>
                {i < 2 ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-800/60 bg-gray-900/30">
        <a href="/preview" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
          View full signals with entry prices →
        </a>
      </div>
    </div>
  );
}
