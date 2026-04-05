import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polymarket Signals is Live on ProductHunt 🚀',
  description:
    'Today we launch Polymarket Signals — AI-powered crypto prediction signals for Polymarket traders. Get 20% off on launch day.',
  openGraph: {
    title: 'Polymarket Signals is Live on ProductHunt 🚀',
    description:
      'AI-powered signals for Polymarket crypto traders. 89% accuracy. 1,200+ signals. Get 20% off on launch day with code LAUNCH20.',
    type: 'website',
  },
};

const stats = [
  { value: '89%', label: 'Signal accuracy' },
  { value: '1,200+', label: 'Signals generated' },
  { value: '5', label: 'Assets covered' },
  { value: '8AM UTC', label: 'Daily delivery' },
];

const TWEET_TEXT = encodeURIComponent(
  'Just discovered @PolymarketSignals — AI-powered signals for Polymarket crypto prediction markets. 89% accuracy, daily delivery. Check it out 👇 https://polymarketsignals.com'
);

const TWITTER_SHARE_URL = `https://twitter.com/intent/tweet?text=${TWEET_TEXT}`;

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 flex flex-col">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-emerald-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-emerald-500/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-lg hover:text-emerald-400 transition-colors"
          >
            <span className="text-xl">⚡</span>
            <span>Polymarket Signals</span>
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg border border-emerald-500 shadow-lg shadow-emerald-500/25 transition-all duration-150"
          >
            Get 20% off today
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          {/* ProductHunt badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-orange-400 text-xs font-medium tracking-wide uppercase mb-8">
            <span className="text-base">🚀</span>
            Live on ProductHunt today
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.08]">
            Today we launch{' '}
            <span className="text-emerald-400">Polymarket Signals</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            AI-powered signals for Polymarket crypto prediction markets. BTC, ETH, SOL, XRP, DOGE.
            Get your entry, stop loss, and take profit every morning — 89% accuracy across 1,200+ signals.
          </p>

          <p className="text-base text-gray-500 mb-10">
            Built for prediction market traders who want an edge, not noise.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl border border-emerald-500 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-150"
            >
              Get 20% off — $15.20/mo for Basic
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Coupon callout */}
          <div className="inline-flex items-center gap-2.5 bg-gray-900 border border-gray-700 rounded-xl px-5 py-3 text-sm mb-4">
            <span className="text-gray-400">Use code at checkout:</span>
            <span className="font-mono font-bold text-emerald-400 text-base tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-lg">
              LAUNCH20
            </span>
            <span className="text-gray-500 text-xs">(Stripe coupon — 20% off first month)</span>
          </div>

          <p className="text-xs text-gray-600 mt-2">
            No credit card required for 7-day trial · Cancel anytime
          </p>
        </section>

        {/* Stats */}
        <section className="border-y border-gray-800 bg-gray-900/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center gap-1.5">
                  <span className="text-3xl sm:text-4xl font-bold text-emerald-400">
                    {stat.value}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            What you get with Basic ($15.20/mo today)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'All 5 crypto assets — BTC, ETH, SOL, XRP, DOGE',
              'Daily signal emails at 8AM UTC',
              'Direction (LONG/SHORT) + Confidence score',
              'Entry price, Stop Loss, Take Profit levels',
              'Web dashboard with signal history',
              '30-day signal archive',
              '7-day free trial included',
              'Cancel anytime, no questions asked',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-gray-900/50 border border-gray-800 rounded-xl px-5 py-4">
                <svg
                  className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ProductHunt upvote embed placeholder */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center">
          <div className="inline-flex flex-col items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl px-8 py-8">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              Support us on ProductHunt
            </p>
            {/* ProductHunt upvote embed — replace the href with your actual PH listing URL */}
            <a
              href="https://www.producthunt.com/posts/polymarket-signals"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-150"
            >
              <span className="text-xl">▲</span>
              <span>Upvote on ProductHunt</span>
            </a>
            <p className="text-xs text-gray-600">
              Every upvote helps us reach more traders. Thank you!
            </p>
          </div>
        </section>

        {/* Share on Twitter */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
          <p className="text-gray-500 text-sm mb-4">Spread the word</p>
          <a
            href={TWITTER_SHARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-150"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X / Twitter
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-6 text-center">
        <p className="text-xs text-gray-700">
          &copy; 2026 Polymarket Signals. Not financial advice. Past performance does not guarantee future results.
        </p>
      </footer>
    </div>
  );
}
