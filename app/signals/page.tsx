import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Crypto Signals for Polymarket | Polymarket Signals',
  description: 'AI-powered trading signals for Polymarket crypto prediction markets. BTC, ETH, SOL, XRP, DOGE — daily LONG/SHORT signals with entry, stop loss, and take profit.',
};

const assets = [
  { key: 'btc', ticker: 'BTC', name: 'Bitcoin', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { key: 'eth', ticker: 'ETH', name: 'Ethereum', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { key: 'sol', ticker: 'SOL', name: 'Solana', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { key: 'xrp', ticker: 'XRP', name: 'XRP', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { key: 'doge', ticker: 'DOGE', name: 'Dogecoin', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
];

export default function SignalsIndexPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Polymarket Crypto Signals
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Daily AI-powered LONG/SHORT signals for the 5 most liquid crypto prediction markets on Polymarket.
            Updated every morning at 8AM UTC.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {assets.map((asset) => (
            <Link
              key={asset.key}
              href={`/signals/${asset.key}`}
              className={`group rounded-2xl border ${asset.border} ${asset.bg} p-6 hover:scale-105 transition-all duration-200 block`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-2xl font-bold font-mono ${asset.color}`}>{asset.ticker}</span>
                <span className="text-gray-500 text-sm">{asset.name}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Daily LONG/SHORT signals with entry, stop loss &amp; take profit
              </p>
              <span className={`text-xs font-medium ${asset.color} group-hover:underline`}>
                View {asset.ticker} signals →
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center rounded-2xl border border-gray-800 bg-gray-900/40 p-8">
          <h2 className="text-xl font-bold text-white mb-2">Access all 5 assets in one dashboard</h2>
          <p className="text-gray-400 text-sm mb-6">
            Subscribe to get all signals delivered to your inbox or dashboard every morning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
            >
              Start 7-day Free Trial
            </Link>
            <Link
              href="/preview"
              className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white text-sm transition-colors"
            >
              Preview signals first →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
