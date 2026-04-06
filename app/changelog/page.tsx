import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Changelog — Polymarket Signals',
  description: 'Version history and upcoming features for Polymarket Signals.',
};

interface Release {
  version: string;
  date: string;
  label?: string;
  status: 'released' | 'upcoming';
  changes: Array<{ text: string; badge?: string }>;
}

const releases: Release[] = [
  {
    version: 'v1.4.0',
    date: 'April 2026',
    label: 'Latest',
    status: 'released',
    changes: [
      { text: 'Discord integration — post signals directly to your Discord server (Pro/API)' },
      { text: 'Slack integration — incoming webhook delivery to your Slack channel (Pro/API)' },
      { text: 'Email digest — SMTP-powered daily signal emails with HTML formatting' },
      { text: 'Signal history — paginated table with asset/direction filters' },
      { text: 'Per-user alert settings — choose which assets and minimum confidence to receive' },
      { text: 'UTM source tracking — admin can see which campaigns drive signups' },
      { text: 'Signup + login rate limiting — 5 signups/hr, 10 logins/15min per IP' },
      { text: 'SEO guides — RSI, MACD, ATR, Bollinger Bands, and Polymarket trading guide' },
      { text: 'REST API v1/history — paginated historical signals endpoint for API plan' },
      { text: 'Annual billing — 17% discount across all plans' },
      { text: 'FAQ, Compare, Guides pages added to site navigation' },
    ],
  },
  {
    version: 'v1.2.0',
    date: 'April 2026',
    status: 'released',
    changes: [
      { text: 'Signal performance tracking dashboard with win rate + P&L history' },
      { text: 'Webhook delivery with HMAC-SHA256 signing and delivery logs' },
      { text: 'Telegram personal alerts — connect your chat ID in Settings' },
      { text: 'Referral program — earn credit for every subscriber you bring in' },
      { text: 'REST API v1 with sliding-window rate limiting (1,000 req/day)' },
      { text: 'Embeddable widget — show live signals on your own site' },
      { text: 'PWA support — add to home screen on iOS/Android' },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'April 2026',
    status: 'released',
    changes: [
      { text: 'BTC, ETH, SOL, XRP, DOGE signal coverage' },
      { text: 'Stripe subscriptions — Basic ($19), Pro ($39), API ($99) plans' },
      { text: 'Signal confidence scoring (RSI + MACD + Bollinger Bands)' },
      { text: 'ATR-based stop loss and 2.5:1 take profit levels' },
      { text: 'Admin dashboard with MRR, users, and signal stats' },
      { text: 'Public status page and health endpoints' },
    ],
  },
  {
    version: 'v1.5.0',
    date: 'Expected May 2026',
    status: 'upcoming',
    changes: [
      { text: 'More assets — BNB, AVAX, LINK', badge: 'Coming Soon' },
      { text: 'Multi-timeframe signals — 1h and 4h alongside 15m', badge: 'Coming Soon' },
      { text: 'Signal outcomes auto-tracking — win/loss detection from price data', badge: 'Coming Soon' },
      { text: 'Team accounts — share one subscription with your trading team', badge: 'Coming Soon' },
    ],
  },
];

function ReleaseBadge({ status }: { status: Release['status'] }) {
  if (status === 'released') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        Released
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
      Upcoming
    </span>
  );
}

function ChangeBadge({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
      {label}
    </span>
  );
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Changelog</h1>
          <p className="text-sm text-gray-500">
            A record of improvements and what&apos;s coming next.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-800 hidden sm:block" />

          <div className="space-y-12">
            {releases.map((release) => (
              <div key={release.version} className="relative sm:pl-14">
                {/* Circle on timeline */}
                <div className="hidden sm:flex absolute left-0 top-1 w-10 h-10 rounded-full bg-gray-900 border border-gray-700 items-center justify-center">
                  {release.status === 'released' ? (
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  ) : (
                    <span className="w-3 h-3 rounded-full bg-yellow-500/60 border border-yellow-500" />
                  )}
                </div>

                {/* Card */}
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-bold text-white">{release.version}</span>
                      <ReleaseBadge status={release.status} />
                    </div>
                    <span className="text-sm text-gray-500">{release.date}</span>
                  </div>

                  <ul className="px-6 py-4 space-y-3">
                    {release.changes.map((change, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 shrink-0 w-4 h-4 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                          {release.status === 'released' ? (
                            <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
                          )}
                        </span>
                        <span className="text-sm text-gray-300">
                          {change.text}
                          <ChangeBadge label={change.badge} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-14 text-center text-xs text-gray-600">
          Have a feature request?{' '}
          <a
            href="mailto:support@polymarketsignals.com"
            className="text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
          >
            Send us a message
          </a>
          .
        </p>
      </main>

      <Footer />
    </div>
  );
}
