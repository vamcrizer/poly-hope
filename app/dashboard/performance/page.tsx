'use client';

import { useEffect, useState } from 'react';

interface SignalOutcome {
  id: number;
  signal_id: number | null;
  asset: string;
  direction: string;
  entry_price: number | null;
  stop_loss: number | null;
  take_profit: number | null;
  exit_price: number | null;
  outcome: 'win' | 'loss' | 'open' | 'expired';
  pnl_pct: number | null;
  generated_at: string | null;
  closed_at: string | null;
}

interface PerformanceStats {
  total: number;
  wins: number;
  losses: number;
  win_rate: number;
  avg_pnl: number;
}

interface PerformanceData {
  outcomes: SignalOutcome[];
  stats: PerformanceStats;
}

function OutcomeBadge({ outcome }: { outcome: SignalOutcome['outcome'] }) {
  const styles: Record<string, string> = {
    win: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    loss: 'bg-red-500/15 text-red-400 border border-red-500/25',
    open: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25',
    expired: 'bg-gray-500/15 text-gray-400 border border-gray-500/25',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${styles[outcome] ?? styles.expired}`}>
      {outcome}
    </span>
  );
}

function PnlCell({ pnl }: { pnl: number | null }) {
  if (pnl === null) return <span className="text-gray-500">—</span>;
  const positive = pnl >= 0;
  return (
    <span className={`font-mono font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
      {positive ? '+' : ''}{pnl.toFixed(2)}%
    </span>
  );
}

function formatPrice(price: number | null, asset: string): string {
  if (price === null) return '—';
  if (asset === 'BTC') return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  if (['XRP', 'DOGE'].includes(asset)) return `$${price.toFixed(3)}`;
  return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function PerformancePage() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/performance')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: PerformanceData) => {
        setData(d);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400 text-sm">Failed to load performance data: {error}</p>
      </div>
    );
  }

  const { stats, outcomes } = data;

  const statCards = [
    {
      label: 'Total Signals Tracked',
      value: stats.total,
      sub: `${stats.wins}W / ${stats.losses}L`,
      color: 'text-white',
    },
    {
      label: 'Win Rate',
      value: `${(stats.win_rate * 100).toFixed(1)}%`,
      sub: 'closed signals',
      color: stats.win_rate >= 0.5 ? 'text-emerald-400' : 'text-red-400',
    },
    {
      label: 'Avg P&L',
      value: `${stats.avg_pnl >= 0 ? '+' : ''}${stats.avg_pnl.toFixed(2)}%`,
      sub: 'per closed signal',
      color: stats.avg_pnl >= 0 ? 'text-emerald-400' : 'text-red-400',
    },
    {
      label: 'Signals in History',
      value: outcomes.length,
      sub: 'last 50 shown',
      color: 'text-white',
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Signal Performance</h1>
        <p className="text-sm text-gray-400 mt-0.5">Historical outcomes for all tracked signals</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white">Recent Signal Outcomes</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Asset</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Dir</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Entry</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Exit</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">P&L</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Result</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {outcomes.map((o) => (
                <tr key={o.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">{o.asset}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${o.direction === 'LONG' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {o.direction}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300 font-mono text-xs">
                    {formatPrice(o.entry_price, o.asset)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300 font-mono text-xs">
                    {formatPrice(o.exit_price, o.asset)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <PnlCell pnl={o.pnl_pct} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <OutcomeBadge outcome={o.outcome} />
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500 text-xs hidden sm:table-cell">
                    {formatDate(o.generated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {outcomes.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-sm">
              No signal outcomes recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
