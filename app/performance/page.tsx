import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signal Performance | Polymarket Signals',
  description: '90-day backtest results across 1,200+ signals. 2.5:1 average risk:reward ratio targeting.',
};

const summaryStats = [
  { value: '2.5:1', label: 'Avg Risk:Reward' },
  { value: '1,200+', label: 'Signals Analyzed' },
  { value: '5', label: 'Assets Covered' },
  { value: '90 days', label: 'Backtest Period' },
];

const assetBreakdown = [
  { asset: 'BTC', signals: 250, rr: '2.4:1' },
  { asset: 'ETH', signals: 240, rr: '2.5:1' },
  { asset: 'SOL', signals: 245, rr: '2.6:1' },
  { asset: 'XRP', signals: 240, rr: '2.5:1' },
  { asset: 'DOGE', signals: 235, rr: '2.5:1' },
];

const strategyPoints = [
  {
    title: 'RSI Thresholds',
    description:
      'LONG signals are triggered when RSI drops below 35 (oversold). SHORT signals are triggered when RSI rises above 65 (overbought). These levels filter out noise and identify high-probability mean-reversion setups.',
  },
  {
    title: 'MACD Confirmation',
    description:
      'Each RSI signal is validated with MACD crossover confirmation. When RSI and MACD agree on direction, the signal is classified as higher confidence — reducing false positives significantly.',
  },
  {
    title: 'ATR-Based Risk Management',
    description:
      'Stop loss is placed at 1.0x ATR from entry, and take profit at 2.5x ATR. This gives the 2.5:1 risk:reward ratio built directly into signal generation — not applied retroactively.',
  },
  {
    title: '12-Hour Timeout Window',
    description:
      'Signals that do not hit their take profit or stop loss within 12 hours are closed at market price. This prevents capital being locked in stale setups and keeps exposure windows short.',
  },
  {
    title: 'Data Source',
    description:
      'All signals are generated from Binance 15-minute OHLCV candlestick data — public data requiring no API key. This makes the methodology fully auditable and reproducible by any third party.',
  },
];

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-20 pb-14 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-medium tracking-wide uppercase mb-6">
              Verified backtest results
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Signal Performance
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              90-day backtest across 1,200+ signals. Full methodology published.
            </p>
          </div>
        </section>

        {/* Summary Stats */}
        <section className="pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {summaryStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 text-center"
                >
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Strategy Methodology
            </h2>
            <p className="text-gray-400 text-sm text-center mb-10">
              Every signal follows a deterministic, rules-based process applied consistently across all assets.
            </p>

            <div className="space-y-4">
              {strategyPoints.map((point, index) => (
                <div
                  key={point.title}
                  className="flex gap-4 bg-gray-900/40 border border-gray-800 rounded-xl p-6"
                >
                  <div className="shrink-0 w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">{point.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Asset Breakdown */}
        <section className="py-16 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Per-Asset Breakdown
            </h2>
            <p className="text-gray-400 text-sm text-center mb-10">
              Results across all 5 covered assets over the 90-day backtest window.
            </p>

            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/30">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Asset</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">Signals</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">Risk:Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {assetBreakdown.map((row, index) => (
                    <tr
                      key={row.asset}
                      className={`border-b border-gray-800/50 last:border-b-0 ${
                        index % 2 === 0 ? 'bg-transparent' : 'bg-gray-900/20'
                      }`}
                    >
                      <td className="py-4 px-6">
                        <span className="font-semibold text-white">{row.asset}</span>
                      </td>
                      <td className="py-4 px-6 text-right text-gray-300 text-sm">
                        {row.signals.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-emerald-400 font-semibold text-sm">{row.rr}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-12 border-t border-gray-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500 text-sm leading-relaxed">
              Past performance does not guarantee future results. Signals are for informational purposes only.
              Backtest results represent historical analysis and may not reflect live trading outcomes.
              Always conduct your own research before making trading decisions.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-gray-800">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to trade smarter?
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Get access to daily signals across BTC, ETH, SOL, XRP, and DOGE. No commitment required.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-3.5 rounded-lg transition-colors text-sm"
            >
              Start 7-day free trial
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
