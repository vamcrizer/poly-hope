import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Trading Guides | Polymarket Signals',
  description: 'Free guides on trading Polymarket crypto prediction markets. Learn RSI, MACD, ATR, and how to use trading signals to find edge on Polymarket.',
};

const guides = [
  {
    href: '/guides/how-to-trade-polymarket-crypto',
    title: 'How to Trade Polymarket Crypto Prediction Markets',
    desc: 'Step-by-step guide to finding edge on Polymarket using RSI, MACD, and ATR signals. Covers signal interpretation, position sizing, and common mistakes.',
    readTime: '8 min read',
    tag: 'Beginner',
  },
  {
    href: '/guides/what-is-rsi-crypto',
    title: 'What is RSI in Crypto Trading?',
    desc: 'Learn how the Relative Strength Index works, what oversold/overbought means, and how RSI drives our LONG/SHORT signals. With practical Polymarket examples.',
    readTime: '6 min read',
    tag: 'Technical Analysis',
  },
  {
    href: '/guides/what-is-macd-crypto',
    title: 'What is MACD in Crypto Trading?',
    desc: 'Understand MACD crossovers, the histogram, bullish/bearish divergence, and how MACD confirms RSI signals to boost confidence scores.',
    readTime: '7 min read',
    tag: 'Technical Analysis',
  },
  {
    href: '/guides/what-is-atr-crypto',
    title: 'What is ATR in Crypto Trading?',
    desc: 'How Average True Range measures volatility, sets stop loss and take profit levels, and why 2.5:1 risk-reward works even with a low win rate.',
    readTime: '6 min read',
    tag: 'Technical Analysis',
  },
  {
    href: '/guides/what-is-bollinger-bands-crypto',
    title: 'What are Bollinger Bands in Crypto Trading?',
    desc: 'Bollinger Band position, squeezes, and breakouts explained. How BB position confirms RSI signals and contributes to the confidence score.',
    readTime: '6 min read',
    tag: 'Technical Analysis',
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Trading Guides</h1>
          <p className="text-gray-400 text-lg">
            Free resources for trading crypto prediction markets on Polymarket.
          </p>
        </div>

        <div className="space-y-4">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="block rounded-2xl border border-gray-800 bg-gray-900/40 p-6 hover:border-gray-700 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {guide.tag}
                </span>
                <span className="text-xs text-gray-600">{guide.readTime}</span>
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                {guide.title}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">{guide.desc}</p>
              <div className="text-xs text-emerald-400 mt-3">Read guide →</div>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-gray-800 bg-gray-900/40 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Put the guides into practice</h2>
          <p className="text-gray-400 text-sm mb-6">
            Daily AI-powered signals for BTC, ETH, SOL, XRP, and DOGE. Start your 7-day free trial.
          </p>
          <Link
            href="/signup"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
