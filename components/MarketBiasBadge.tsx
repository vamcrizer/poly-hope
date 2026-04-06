'use client';

import type { Signal } from '@/types';

interface Props {
  signals: Signal[];
}

export function MarketBiasBadge({ signals }: Props) {
  if (signals.length === 0) return null;

  const longs = signals.filter((s) => s.direction === 'LONG').length;
  const shorts = signals.filter((s) => s.direction === 'SHORT').length;
  const total = signals.length;
  const longPct = Math.round((longs / total) * 100);

  const label =
    longs > shorts ? 'Bullish Bias' : longs < shorts ? 'Bearish Bias' : 'Neutral';
  const color =
    longs > shorts
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      : longs < shorts
      ? 'text-red-400 bg-red-500/10 border-red-500/20'
      : 'text-gray-400 bg-gray-800 border-gray-700';

  return (
    <div className="flex items-center gap-3">
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${longs > shorts ? 'bg-emerald-400' : longs < shorts ? 'bg-red-400' : 'bg-gray-500'}`} />
        {label}
      </span>
      <span className="text-xs text-gray-600">
        {longs}L / {shorts}S
      </span>
      <div className="w-20 h-1.5 rounded-full bg-gray-800 overflow-hidden hidden sm:block">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${longPct}%` }}
        />
      </div>
    </div>
  );
}
