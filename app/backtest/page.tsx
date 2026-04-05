'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AssetMetrics {
  total_trades: number;
  win_rate: number;
  avg_return: number;
  total_return: number;
  sharpe_ratio: number;
  max_drawdown: number;
  long_trades: number;
  short_trades: number;
  take_profit_count: number;
  stop_loss_count: number;
  timeout_count: number;
}

interface AssetResult {
  asset: string;
  symbol: string;
  backtest_days: number;
  bars_analyzed: number;
  metrics: AssetMetrics;
  recent_trades: RecentTrade[];
}

interface RecentTrade {
  entry_time: string;
  exit_time: string;
  direction: 'LONG' | 'SHORT';
  entry_price: number;
  exit_price: number;
  stop_loss: number;
  take_profit: number;
  outcome: 'take_profit' | 'stop_loss' | 'timeout';
  pnl_pct: number;
  confidence: number;
}

interface BacktestReport {
  generated_at: string;
  backtest_days: number;
  timeframe: string;
  strategy: {
    rsi_long_threshold: number;
    rsi_short_threshold: number;
    sl_atr_mult: number;
    tp_atr_mult: number;
    timeout_bars: number;
  };
  aggregate: AssetMetrics;
  assets: AssetResult[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function pct(val: number, decimals = 1): string {
  return `${(val * 100).toFixed(decimals)}%`;
}

function signed(val: number, decimals = 2): string {
  const s = (val * 100).toFixed(decimals);
  return val >= 0 ? `+${s}%` : `${s}%`;
}

function fmt(val: number): string {
  return val.toFixed(2);
}

const ASSET_COLORS: Record<string, string> = {
  BTC: 'text-orange-400',
  ETH: 'text-blue-400',
  SOL: 'text-purple-400',
  XRP: 'text-cyan-400',
  DOGE: 'text-yellow-400',
};

const OUTCOME_BADGE: Record<string, 'green' | 'red' | 'gray'> = {
  take_profit: 'green',
  stop_loss: 'red',
  timeout: 'gray',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  subtext,
  positive,
}: {
  label: string;
  value: string;
  subtext?: string;
  positive?: boolean;
}) {
  const valueColor =
    positive === undefined
      ? 'text-white'
      : positive
        ? 'text-emerald-400'
        : 'text-red-400';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-1">
      <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
        {label}
      </span>
      <span className={`text-3xl font-bold ${valueColor}`}>{value}</span>
      {subtext && <span className="text-xs text-gray-600">{subtext}</span>}
    </div>
  );
}

function MetricRow({
  label,
  value,
  valueClass = 'text-gray-200',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function AssetCard({ asset }: { asset: AssetResult }) {
  const m = asset.metrics;
  const color = ASSET_COLORS[asset.asset] || 'text-gray-300';
  const isPositive = m.total_return >= 0;

  return (
    <Card>
      <CardHeader className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-xl font-bold ${color}`}>{asset.asset}</span>
            <Badge variant="gray">{asset.symbol}</Badge>
          </div>
          <span
            className={`text-lg font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {signed(m.total_return)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <div className="grid grid-cols-2 gap-x-8">
          <div>
            <MetricRow
              label="Win Rate"
              value={pct(m.win_rate)}
              valueClass={m.win_rate >= 0.5 ? 'text-emerald-400' : 'text-red-400'}
            />
            <MetricRow
              label="Avg Return"
              value={signed(m.avg_return)}
              valueClass={m.avg_return >= 0 ? 'text-emerald-400' : 'text-red-400'}
            />
            <MetricRow label="Sharpe Ratio" value={fmt(m.sharpe_ratio)} />
            <MetricRow
              label="Max Drawdown"
              value={pct(m.max_drawdown)}
              valueClass="text-red-400"
            />
          </div>
          <div>
            <MetricRow label="Total Trades" value={m.total_trades.toString()} />
            <MetricRow label="LONG / SHORT" value={`${m.long_trades} / ${m.short_trades}`} />
            <MetricRow
              label="Take Profit"
              value={m.take_profit_count.toString()}
              valueClass="text-emerald-400"
            />
            <MetricRow
              label="Stop Loss"
              value={m.stop_loss_count.toString()}
              valueClass="text-red-400"
            />
          </div>
        </div>

        {/* Recent trades mini-table */}
        {asset.recent_trades.length > 0 && (
          <div className="mt-5">
            <p className="text-xs text-gray-600 uppercase tracking-wider font-medium mb-2">
              Recent Trades
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-600 text-left">
                    <th className="pb-1.5 pr-3 font-medium">Date</th>
                    <th className="pb-1.5 pr-3 font-medium">Dir</th>
                    <th className="pb-1.5 pr-3 font-medium">Outcome</th>
                    <th className="pb-1.5 text-right font-medium">P&amp;L</th>
                  </tr>
                </thead>
                <tbody>
                  {asset.recent_trades.slice(-8).map((trade, idx) => {
                    const date = new Date(trade.entry_time).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                    return (
                      <tr key={idx} className="border-t border-gray-800/60">
                        <td className="py-1 pr-3 text-gray-500">{date}</td>
                        <td className="py-1 pr-3">
                          <Badge
                            variant={trade.direction === 'LONG' ? 'green' : 'red'}
                          >
                            {trade.direction}
                          </Badge>
                        </td>
                        <td className="py-1 pr-3">
                          <Badge variant={OUTCOME_BADGE[trade.outcome] ?? 'gray'}>
                            {trade.outcome.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td
                          className={`py-1 text-right font-semibold ${
                            trade.pnl_pct >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {signed(trade.pnl_pct)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-800 rounded ${className}`} />
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function BacktestPage() {
  const [report, setReport] = useState<BacktestReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/backtest')
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body) => {
            throw new Error(body.error || `HTTP ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data: BacktestReport) => {
        setReport(data);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const generatedAt = report
    ? new Date(report.generated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Backtest Performance
                </h1>
                <Badge variant="gray">Public</Badge>
              </div>
              <p className="text-gray-400 text-sm max-w-xl">
                Historical signal performance over the last{' '}
                <span className="text-gray-200 font-medium">
                  {report?.backtest_days ?? 90} days
                </span>{' '}
                using{' '}
                <span className="text-gray-200 font-medium">
                  {report?.timeframe ?? '15m'}
                </span>{' '}
                candles. RSI + MACD strategy with 2:1 risk-to-reward.
              </p>
            </div>
            {generatedAt && (
              <p className="text-xs text-gray-600 whitespace-nowrap">
                Last updated {generatedAt}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && <LoadingSkeleton />}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-red-400 font-semibold mb-1">Report Unavailable</p>
            <p className="text-red-400/70 text-sm">{error}</p>
            <p className="text-gray-600 text-xs mt-3">
              Run{' '}
              <code className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">
                python scripts/backtest_report.py
              </code>{' '}
              to generate the report.
            </p>
          </div>
        )}

        {report && !loading && (
          <div className="space-y-10">
            {/* Aggregate stats */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Overall Performance — All Assets
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard
                  label="Win Rate"
                  value={pct(report.aggregate.win_rate)}
                  subtext={`${report.aggregate.total_trades} trades`}
                  positive={report.aggregate.win_rate >= 0.5}
                />
                <StatCard
                  label="Total Return"
                  value={signed(report.aggregate.total_return, 1)}
                  subtext={`${report.backtest_days}-day period`}
                  positive={report.aggregate.total_return >= 0}
                />
                <StatCard
                  label="Avg Return / Trade"
                  value={signed(report.aggregate.avg_return)}
                  positive={report.aggregate.avg_return >= 0}
                />
                <StatCard
                  label="Sharpe Ratio"
                  value={fmt(report.aggregate.sharpe_ratio)}
                  subtext="Annualized"
                  positive={report.aggregate.sharpe_ratio >= 1}
                />
              </div>
            </section>

            {/* Strategy parameters */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Strategy Parameters
              </h2>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
                  <div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">RSI Long</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {'<'} {report.strategy.rsi_long_threshold}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">RSI Short</div>
                    <div className="text-lg font-bold text-red-400">
                      {'>'} {report.strategy.rsi_short_threshold}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Stop Loss</div>
                    <div className="text-lg font-bold text-gray-200">
                      {report.strategy.sl_atr_mult}× ATR
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Take Profit</div>
                    <div className="text-lg font-bold text-gray-200">
                      {report.strategy.tp_atr_mult}× ATR
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Confirmation</div>
                    <div className="text-lg font-bold text-gray-200">MACD</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Per-asset breakdown */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Per-Asset Breakdown
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {report.assets.map((asset) => (
                  <AssetCard key={asset.asset} asset={asset} />
                ))}
              </div>
            </section>

            {/* Trade outcome summary */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Trade Outcome Summary
              </h2>
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800/50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-5 py-3 font-semibold">Asset</th>
                      <th className="text-right px-5 py-3 font-semibold">Trades</th>
                      <th className="text-right px-5 py-3 font-semibold">Win Rate</th>
                      <th className="text-right px-5 py-3 font-semibold">Take Profit</th>
                      <th className="text-right px-5 py-3 font-semibold">Stop Loss</th>
                      <th className="text-right px-5 py-3 font-semibold">Timeout</th>
                      <th className="text-right px-5 py-3 font-semibold">Max DD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.assets.map((a, idx) => {
                      const m = a.metrics;
                      const color = ASSET_COLORS[a.asset] || 'text-gray-300';
                      return (
                        <tr
                          key={a.asset}
                          className={`border-t border-gray-800 ${idx % 2 === 0 ? '' : 'bg-gray-800/10'}`}
                        >
                          <td className={`px-5 py-3 font-bold ${color}`}>{a.asset}</td>
                          <td className="px-5 py-3 text-right text-gray-300">
                            {m.total_trades}
                          </td>
                          <td
                            className={`px-5 py-3 text-right font-semibold ${
                              m.win_rate >= 0.5 ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {pct(m.win_rate)}
                          </td>
                          <td className="px-5 py-3 text-right text-emerald-400">
                            {m.take_profit_count}
                          </td>
                          <td className="px-5 py-3 text-right text-red-400">
                            {m.stop_loss_count}
                          </td>
                          <td className="px-5 py-3 text-right text-gray-500">
                            {m.timeout_count}
                          </td>
                          <td className="px-5 py-3 text-right text-red-400">
                            {pct(m.max_drawdown)}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Aggregate row */}
                    <tr className="border-t-2 border-gray-700 bg-gray-800/30 font-semibold">
                      <td className="px-5 py-3 text-white">All</td>
                      <td className="px-5 py-3 text-right text-white">
                        {report.aggregate.total_trades}
                      </td>
                      <td
                        className={`px-5 py-3 text-right ${
                          report.aggregate.win_rate >= 0.5
                            ? 'text-emerald-400'
                            : 'text-red-400'
                        }`}
                      >
                        {pct(report.aggregate.win_rate)}
                      </td>
                      <td className="px-5 py-3 text-right text-emerald-400">
                        {report.aggregate.take_profit_count}
                      </td>
                      <td className="px-5 py-3 text-right text-red-400">
                        {report.aggregate.stop_loss_count}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-500">
                        {report.aggregate.timeout_count}
                      </td>
                      <td className="px-5 py-3 text-right text-red-400">
                        {pct(report.aggregate.max_drawdown)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="border-t border-gray-800 pt-6">
              <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
                <strong className="text-gray-500">Disclaimer:</strong> Backtest results are
                simulated using historical data and do not guarantee future performance. This
                report is generated automatically and updated weekly. All signals are for
                informational purposes only and do not constitute financial advice.
                Polymarket prediction markets carry significant risk of loss.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
