import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const ASSETS: Record<string, { name: string; desc: string; color: string }> = {
  btc: { name: 'Bitcoin (BTC)', desc: 'the largest cryptocurrency by market cap', color: 'text-orange-400' },
  eth: { name: 'Ethereum (ETH)', desc: 'the leading smart contract platform', color: 'text-blue-400' },
  sol: { name: 'Solana (SOL)', desc: 'a high-performance layer-1 blockchain', color: 'text-purple-400' },
  xrp: { name: 'XRP', desc: 'Ripple\'s cross-border payment token', color: 'text-cyan-400' },
  doge: { name: 'Dogecoin (DOGE)', desc: 'the original meme cryptocurrency', color: 'text-yellow-400' },
};

export function generateStaticParams() {
  return Object.keys(ASSETS).map((asset) => ({ asset }));
}

type PageProps = { params: { asset: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const assetKey = (params?.asset ?? '').toLowerCase();
  const info = ASSETS[assetKey];
  if (!info) return {};
  const ticker = assetKey.toUpperCase();
  return {
    title: `${ticker} Polymarket Signals — Daily Trading Signals`,
    description: `AI-powered ${ticker} signals for Polymarket prediction markets. Get daily LONG/SHORT signals with entry, stop loss, and take profit for ${info.name}.`,
    openGraph: {
      title: `${ticker} Polymarket Signals`,
      description: `Daily AI-powered ${ticker} signals for Polymarket. Updated 8AM UTC.`,
    },
  };
}

export default function AssetSignalsPage({ params }: PageProps) {
  const assetKey = (params?.asset ?? '').toLowerCase();
  const info = ASSETS[assetKey];
  if (!info) notFound();

  const ticker = assetKey.toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/signals" className="hover:text-gray-400 transition-colors">Signals</Link>
          <span>›</span>
          <span className="text-gray-400">{ticker}</span>
        </div>

        {/* Hero */}
        <div className="mb-12">
          <span className={`text-lg font-bold font-mono ${info.color} mb-2 block`}>{ticker}</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {ticker} Polymarket Signals
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            AI-powered daily trading signals for {info.name} — {info.desc}. Updated every morning at{' '}
            <span className="text-white font-medium">8AM UTC</span> with LONG/SHORT direction, entry price,
            stop loss, and take profit levels calculated using RSI, MACD, and ATR analysis.
          </p>
        </div>

        {/* What you get */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">What&apos;s included in each {ticker} signal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Direction', val: 'LONG or SHORT', desc: 'Clear directional bias based on technical analysis' },
              { label: 'Confidence', val: '55–85%', desc: 'Normalized RSI + MACD agreement score' },
              { label: 'Entry Price', val: 'Exact level', desc: 'Current market price at signal generation' },
              { label: 'Stop Loss', val: '1.0× ATR below', desc: 'ATR-based risk level for position sizing' },
              { label: 'Take Profit', val: '2.5× ATR above', desc: '2.5:1 risk-reward target by default' },
              { label: 'Timeframe', val: '15-minute', desc: 'Based on 15-minute OHLCV candles from Binance' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300">{item.label}</span>
                  <span className="text-xs font-mono text-emerald-400">{item.val}</span>
                </div>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="mb-10 rounded-xl border border-gray-800 bg-gray-900/60 p-6">
          <h2 className="text-lg font-bold text-white mb-3">Signal generation methodology</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
              <span><strong className="text-gray-300">RSI (14-period)</strong>: LONG when RSI &lt; 35 (oversold), SHORT when RSI &gt; 65 (overbought)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
              <span><strong className="text-gray-300">MACD confirmation</strong>: Bullish MACD adds +3% confidence to LONG signals</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
              <span><strong className="text-gray-300">Bollinger Band position</strong>: Price near lower band adds +2% to LONG confidence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
              <span><strong className="text-gray-300">Data source</strong>: Binance public API — 15-minute OHLCV, 200 bars</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8">
          <h3 className="text-xl font-bold text-white mb-2">Get today&apos;s {ticker} signal</h3>
          <p className="text-gray-400 text-sm mb-6">
            Start a 7-day free trial and access daily {ticker} signals with entry, stop loss, and take profit.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
          >
            Start Free Trial
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-xs text-gray-600 mt-3">No credit card required · Cancel anytime</p>
        </div>

        {/* Other assets */}
        <div className="mt-12">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Also available</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ASSETS).filter(([key]) => key !== assetKey).map(([key, asset]) => (
              <Link
                key={key}
                href={`/signals/${key}`}
                className="px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900/40 text-sm text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
              >
                {key.toUpperCase()} Signals
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
