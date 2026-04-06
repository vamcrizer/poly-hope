import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Live Signal Preview — Polymarket Signals',
  description:
    'See today\'s AI-generated crypto trading signals for BTC, ETH, SOL, XRP and DOGE. LONG/SHORT calls with entry, stop-loss, and take-profit levels.',
  robots: { index: true, follow: true },
};

// Static preview signals (realistic as of April 2026)
const previewSignals = [
  {
    asset: 'BTC',
    direction: 'LONG' as const,
    confidence: 0.78,
    entry_price: 83200,
    stop_loss: 81000,
    take_profit: 87500,
    timeframe: '15m',
    rr: '2.1',
    assetColor: 'text-orange-400',
  },
  {
    asset: 'ETH',
    direction: 'LONG' as const,
    confidence: 0.71,
    entry_price: 1820,
    stop_loss: 1760,
    take_profit: 1950,
    timeframe: '10m',
    rr: '2.2',
    assetColor: 'text-blue-400',
  },
  {
    asset: 'SOL',
    direction: 'SHORT' as const,
    confidence: 0.65,
    entry_price: 132,
    stop_loss: 138,
    take_profit: 118,
    timeframe: '15m',
    rr: '2.3',
    assetColor: 'text-purple-400',
  },
];

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(4);
  return price.toFixed(6);
}

function PreviewSignalCard({
  signal,
  blurred = false,
}: {
  signal: (typeof previewSignals)[0];
  blurred?: boolean;
}) {
  const confidenceColor =
    signal.confidence >= 0.75
      ? 'text-emerald-400'
      : signal.confidence >= 0.65
        ? 'text-yellow-400'
        : 'text-orange-400';

  const directionBg =
    signal.direction === 'LONG'
      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
      : 'bg-red-500/15 text-red-400 border border-red-500/30';

  return (
    <div className={`relative rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden ${blurred ? 'select-none' : ''}`}>
      {blurred && (
        <div className="absolute inset-0 z-10 backdrop-blur-sm bg-gray-950/60 flex flex-col items-center justify-center gap-3 px-4 text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-white">2 more signals today</p>
          <p className="text-xs text-gray-400">XRP and DOGE signals are available for subscribers</p>
          <Link
            href="/signup"
            className="mt-1 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
          >
            Get All Signals →
          </Link>
        </div>
      )}
      <div className={blurred ? 'blur-sm pointer-events-none' : ''}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className={`text-xl font-bold ${signal.assetColor}`}>{signal.asset}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-md ${directionBg}`}>
              {signal.direction}
            </span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-800/80 px-2 py-1 rounded">{signal.timeframe}</span>
        </div>

        {/* Confidence */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 uppercase tracking-wide">AI Confidence</span>
            <span className={`text-sm font-bold ${confidenceColor}`}>
              {Math.round(signal.confidence * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${signal.confidence >= 0.75 ? 'bg-emerald-500' : signal.confidence >= 0.65 ? 'bg-yellow-500' : 'bg-orange-500'}`}
              style={{ width: `${signal.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Price levels */}
        <div className="grid grid-cols-3 gap-0 px-4 pb-3 pt-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Entry</p>
            <p className="text-sm font-semibold text-gray-100">${formatPrice(signal.entry_price)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-red-500 uppercase tracking-wide mb-0.5">Stop Loss</p>
            <p className="text-sm font-semibold text-red-400">${formatPrice(signal.stop_loss)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-emerald-500 uppercase tracking-wide mb-0.5">Take Profit</p>
            <p className="text-sm font-semibold text-emerald-400">${formatPrice(signal.take_profit)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-800">
          <span className="text-xs text-gray-600">R:R {signal.rr}x</span>
          <span className="text-xs text-gray-600">Updated 8:00 AM UTC</span>
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-emerald-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live signals — updated 8AM UTC daily
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Today&apos;s Trading Signals
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            AI-generated LONG/SHORT calls with entry, stop-loss, and take-profit levels
            for BTC, ETH, SOL, XRP, and DOGE.
          </p>
        </div>

        {/* Signal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {previewSignals.map((signal, i) => (
            <PreviewSignalCard
              key={signal.asset}
              signal={signal}
              blurred={i === 2}
            />
          ))}
        </div>

        {/* Blurred CTA row for remaining assets */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-5 mb-12">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {['text-cyan-400', 'text-yellow-400'].map((color, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center">
                  <span className={`text-xs font-bold ${color}`}>{i === 0 ? 'XRP' : 'DOGE'}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">XRP &amp; DOGE signals locked</p>
              <p className="text-xs text-gray-500">Subscribe to unlock all 5 assets</p>
            </div>
          </div>
          <Link
            href="/signup"
            className="shrink-0 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-colors"
          >
            Start Free Trial — $19/mo
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { value: '2.5:1', label: 'Risk:Reward target' },
            { value: '1,200+', label: 'Signals generated' },
            { value: '5', label: 'Assets covered' },
            { value: '2.1x', label: 'Avg risk:reward' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-800 bg-gray-900/40 px-4 py-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Get every signal, every day
          </h2>
          <p className="text-sm text-gray-400 mb-5 max-w-md mx-auto">
            Full dashboard access, email delivery, Telegram alerts, and API integration.
            Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 font-medium text-sm transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
