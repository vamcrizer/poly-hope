import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polymarket Signals is Live on ProductHunt',
  description:
    'Today we launch Polymarket Signals — AI-powered crypto prediction signals for Polymarket traders. 2.5:1 avg risk:reward, 1,200+ signals. Get 30% off with code PHLAUNGH.',
  openGraph: {
    title: 'Polymarket Signals is Live on ProductHunt',
    description:
      'AI-powered signals for Polymarket crypto traders. 2.5:1 avg risk:reward. 1,200+ signals generated. Get 30% off your first month with code PHLAUNGH.',
    type: 'website',
  },
};

const stats = [
  { value: '2.5:1', label: 'Avg Risk:Reward' },
  { value: '1,200+', label: 'Signals generated' },
  { value: '5', label: 'Assets covered' },
  { value: '8AM UTC', label: 'Daily delivery' },
];

const keyFeatures = [
  {
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Daily AI Signals',
    description:
      'Every morning at 8AM UTC get LONG/SHORT calls with entry price, stop loss, and take profit for BTC, ETH, SOL, XRP, and DOGE — calibrated specifically for Polymarket binary positions.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Transparent Backtest Data',
    description:
      '2.5:1 average risk:reward ratio over a 90-day backtest on 1,200+ signals. Full methodology published — entry/exit logic, RSI/MACD/ATR indicators, and per-asset breakdowns included.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Multi-Timeframe Coverage',
    description:
      'Signals across 5m, 10m, and 15m windows to match the most actively traded Polymarket resolution markets. No guesswork on which timeframe to trade.',
  },
];

const TWEET_TEXT = encodeURIComponent(
  'Just discovered Polymarket Signals — AI-powered signals for Polymarket crypto prediction markets. 2.5:1 avg risk:reward ratio, daily delivery. Check it out: https://polymarketsignals.com'
);
const TWITTER_SHARE_URL = `https://twitter.com/intent/tweet?text=${TWEET_TEXT}`;

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 flex flex-col">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-emerald-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-emerald-500/3 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-orange-500/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-lg hover:text-emerald-400 transition-colors"
          >
            <span className="text-xl">&#9889;</span>
            <span>Polymarket Signals</span>
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg border border-emerald-500 shadow-lg shadow-emerald-500/25 transition-all duration-150"
          >
            Start Free Trial
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          {/* ProductHunt badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-orange-400 text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            We&apos;re live on ProductHunt today
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.08]">
            AI signals built for{' '}
            <span className="text-emerald-400">Polymarket</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-5 leading-relaxed">
            Stop guessing. Get daily directional calls for BTC, ETH, SOL, XRP, and DOGE —
            with entry, stop loss, and take profit — tuned for Polymarket&apos;s YES/NO binary markets.
          </p>

          <p className="text-base text-gray-500 mb-10">
            2.5:1 avg R:R &middot; 90-day backtest &middot; 1,200+ signals generated &middot; Updated 8AM UTC daily
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="https://www.producthunt.com/posts/polymarket-signals"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl border border-orange-400 shadow-2xl shadow-orange-500/25 transition-all duration-150"
            >
              <span className="text-lg font-black">&#9650;</span>
              Upvote on ProductHunt
            </a>
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl border border-emerald-500 shadow-2xl shadow-emerald-500/30 transition-all duration-150"
            >
              Start 3-Day Free Trial
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Launch discount banner */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-gray-900 border border-emerald-500/20 rounded-xl px-6 py-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="font-bold text-sm uppercase tracking-wide">Launch Offer</span>
            </div>
            <span className="text-gray-400 text-sm hidden sm:block">|</span>
            <span className="text-gray-300 text-sm">
              Use code{' '}
              <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                PHLAUNGH
              </span>{' '}
              for <span className="text-white font-semibold">30% off your first month</span>
            </span>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-gray-800 bg-gray-900/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center gap-1.5">
                  <span className="text-3xl sm:text-4xl font-bold text-emerald-400">{stat.value}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key features */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3">
            What makes Polymarket Signals different
          </h2>
          <p className="text-gray-500 text-center mb-12 text-base">
            Built specifically for prediction markets, not generic crypto trading.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {keyFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Email capture */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Get started in 30 seconds</h2>
            <p className="text-gray-400 text-sm mb-6">
              Enter your email to create your free account. No credit card required.
            </p>
            <form
              action="/api/auth/signup"
              method="POST"
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl border border-emerald-500 shadow-lg shadow-emerald-500/25 transition-all duration-150 whitespace-nowrap"
              >
                Create free account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </form>
            <p className="text-xs text-gray-600 mt-4">
              Then use code{' '}
              <span className="font-mono text-emerald-400">PHLAUNGH</span>{' '}
              at checkout for 30% off your first paid month.
            </p>
          </div>
        </section>

        {/* Social share */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
          <p className="text-gray-500 text-sm mb-5">Know a Polymarket trader who would benefit? Share this.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={TWITTER_SHARE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X / Twitter
            </a>
            <a
              href="https://www.producthunt.com/posts/polymarket-signals"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 text-sm"
            >
              <span className="font-black">&#9650;</span>
              Upvote on ProductHunt
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-6 text-center">
        <p className="text-xs text-gray-700">
          &copy; 2026 Polymarket Signals &middot; Not financial advice &middot; Past performance does not guarantee future results
        </p>
      </footer>
    </div>
  );
}
