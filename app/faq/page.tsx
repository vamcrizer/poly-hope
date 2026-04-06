import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'FAQ — Polymarket Signals | How It Works',
  description: 'Answers to common questions about Polymarket Signals — how signals are generated, what assets are covered, how to use them on Polymarket, and more.',
};

const sections = [
  {
    title: 'About the signals',
    faqs: [
      {
        q: 'What exactly is a "Polymarket signal"?',
        a: 'A signal is a daily trading recommendation for a specific crypto asset. It includes a direction (LONG or SHORT), a confidence score, and specific price levels: entry, stop loss, and take profit. We generate one set of signals per day at 8AM UTC.',
      },
      {
        q: 'Which assets do you cover?',
        a: 'We cover the 5 most liquid crypto prediction markets on Polymarket: Bitcoin (BTC), Ethereum (ETH), Solana (SOL), XRP, and Dogecoin (DOGE). Coverage expands as new Polymarket markets become sufficiently liquid.',
      },
      {
        q: 'How are signals generated?',
        a: 'Signals are generated using a multi-indicator technical analysis system running on 15-minute OHLCV data from Binance. We use RSI (14-period) for direction, MACD for momentum confirmation, and Bollinger Bands for band position scoring. ATR is used to set stop loss and take profit levels.',
      },
      {
        q: 'What does the confidence score mean?',
        a: 'The confidence score (shown as a percentage, typically 55–85%) reflects how strongly aligned the indicators are. A higher confidence means RSI, MACD, and Bollinger Bands all agree on the direction. It is not a win probability — it is an indicator agreement score.',
      },
      {
        q: 'How are stop loss and take profit calculated?',
        a: 'We use ATR (Average True Range) as a volatility proxy. Stop loss is set at 1× ATR away from entry. Take profit is set at 2.5× ATR away, giving a 2.5:1 risk-reward ratio by default.',
      },
    ],
  },
  {
    title: 'Using signals on Polymarket',
    faqs: [
      {
        q: 'How do I use these signals on Polymarket?',
        a: 'Polymarket has binary prediction markets like "Will BTC be above $90,000 on June 30?" A LONG signal means we think the price will be higher — so you\'d bet YES on an above-threshold market. A SHORT signal means we expect price to fall — bet NO or look for a below-threshold market.',
      },
      {
        q: 'Can I use these signals for regular crypto trading (not Polymarket)?',
        a: 'Yes. The entry, stop loss, and take profit levels are real price targets applicable to any spot or derivatives exchange. While we optimize our framing for prediction markets, the underlying signal is asset-agnostic.',
      },
      {
        q: 'Should I trade every signal?',
        a: 'No. You should filter signals by your own risk tolerance. We recommend using the confidence threshold filter (available in settings) to only receive signals above a minimum confidence level. Higher confidence signals reflect stronger indicator alignment.',
      },
    ],
  },
  {
    title: 'Subscription & billing',
    faqs: [
      {
        q: 'What is included in the free trial?',
        a: 'The 7-day free trial gives you full access to all features of the Basic plan, including daily signals for all 5 assets, Telegram alerts, and CSV export. No credit card is required to start.',
      },
      {
        q: 'What is the difference between Basic, Pro, and API plans?',
        a: 'Basic ($19/mo) covers daily signals + Telegram + email + CSV export. Pro ($39/mo) adds Slack integration, webhook delivery, and signal history. API ($99/mo) adds full REST API access and priority support. Annual billing saves 17% across all plans.',
      },
      {
        q: 'Can I cancel anytime?',
        a: 'Yes. You can cancel your subscription at any time from the account settings page. Your access continues until the end of the current billing period.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'We offer a full refund within 7 days of your first paid charge if you are not satisfied. Contact us via the support link in your dashboard.',
      },
    ],
  },
  {
    title: 'Delivery & integrations',
    faqs: [
      {
        q: 'How do I receive signals?',
        a: 'Signals are available in your dashboard every morning at 8AM UTC. You can also receive them via email, Telegram (connect your chat ID in settings), Slack (Pro/API), or webhooks (Pro/API). CSV export is available from the dashboard.',
      },
      {
        q: 'How do I set up Telegram alerts?',
        a: 'Start a conversation with our Telegram bot, get your chat ID, and paste it in Dashboard → Settings → Telegram. You\'ll receive a formatted signal digest each morning.',
      },
      {
        q: 'What is the webhook format?',
        a: 'Webhooks send a JSON array of signal objects to your configured URL. Each object contains: asset, direction, confidence, entry_price, stop_loss, take_profit, timeframe, generated_at. An HMAC-SHA256 signature is included in the X-Webhook-Signature header for validation.',
      },
      {
        q: 'Is there an API I can query programmatically?',
        a: 'Yes, on the API plan. Generate an API key in Dashboard → API Key and use it as a Bearer token. The REST API is documented at /docs.',
      },
    ],
  },
  {
    title: 'Risk & disclaimers',
    faqs: [
      {
        q: 'Are these signals guaranteed to be profitable?',
        a: 'No. No trading signal service can guarantee profits. Past backtested performance does not guarantee future results. All trading involves risk. Use position sizing and never risk more than you can afford to lose.',
      },
      {
        q: 'Is this financial advice?',
        a: 'No. Polymarket Signals provides educational information and technical analysis tools. Nothing on this platform constitutes financial advice, investment advice, or a recommendation to buy or sell any asset.',
      },
    ],
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What exactly is a "Polymarket signal"?', acceptedAnswer: { '@type': 'Answer', text: 'A signal is a daily trading recommendation including direction (LONG or SHORT), confidence score, entry price, stop loss, and take profit. Generated at 8AM UTC.' } },
    { '@type': 'Question', name: 'Which assets do you cover?', acceptedAnswer: { '@type': 'Answer', text: 'BTC, ETH, SOL, XRP, and DOGE — the 5 most liquid crypto prediction markets on Polymarket.' } },
    { '@type': 'Question', name: 'How are signals generated?', acceptedAnswer: { '@type': 'Answer', text: 'RSI (14-period) for direction, MACD for momentum confirmation, and Bollinger Bands for position scoring. ATR sets stop loss and take profit.' } },
    { '@type': 'Question', name: 'What is the confidence score?', acceptedAnswer: { '@type': 'Answer', text: 'A normalized 55–85% score reflecting how strongly RSI, MACD, and Bollinger Bands agree on the direction.' } },
    { '@type': 'Question', name: 'What is included in the free trial?', acceptedAnswer: { '@type': 'Answer', text: '7 days of full access with no credit card required. Daily signals, Telegram alerts, CSV export.' } },
    { '@type': 'Question', name: 'Can I cancel anytime?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Cancel from account settings. Access continues until end of billing period.' } },
    { '@type': 'Question', name: 'Is this financial advice?', acceptedAnswer: { '@type': 'Answer', text: 'No. Polymarket Signals provides technical analysis tools. Nothing constitutes financial advice or a recommendation to buy or sell.' } },
  ],
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently asked questions
          </h1>
          <p className="text-gray-400 text-lg">
            Everything you need to know about Polymarket Signals.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-bold text-white mb-5 pb-3 border-b border-gray-800">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.faqs.map((faq) => (
                  <div key={faq.q} className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                    <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center rounded-2xl border border-gray-800 bg-gray-900/40 p-8">
          <h2 className="text-xl font-bold text-white mb-2">Still have questions?</h2>
          <p className="text-gray-400 text-sm mb-6">
            Can&apos;t find what you&apos;re looking for? Read the full documentation or start your free trial to explore the platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/docs"
              className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white text-sm transition-colors"
            >
              Read the docs →
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
