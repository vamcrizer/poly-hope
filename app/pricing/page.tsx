import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TrustBadges } from '@/components/TrustBadges';
import { PricingPlans } from '@/components/PricingPlans';

const plans = [
  {
    name: 'Basic',
    price: '$19',
    period: '/mo',
    description: 'For retail traders getting started with prediction markets.',
    features: {
      assets: '5 assets (BTC, ETH, SOL, XRP, DOGE)',
      signals: 'Daily signals (8AM UTC)',
      direction: true,
      confidence: true,
      entryExit: true,
      multiTimeframe: false,
      backtestReport: false,
      notifications: false,
      history: '30-day history',
      apiAccess: false,
      webhooks: false,
      support: 'Email support',
      sla: false,
    },
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: false,
    paid: true,
  },
  {
    name: 'Pro',
    price: '$39',
    period: '/mo',
    description: 'For serious traders who want deeper analysis.',
    features: {
      assets: '5 assets (BTC, ETH, SOL, XRP, DOGE)',
      signals: 'Daily signals (8AM UTC)',
      direction: true,
      confidence: true,
      entryExit: true,
      multiTimeframe: true,
      backtestReport: true,
      notifications: 'Slack + Telegram',
      history: '90-day history',
      apiAccess: false,
      webhooks: false,
      support: 'Priority email support',
      sla: false,
    },
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: true,
    badge: 'Most Popular',
    paid: true,
  },
  {
    name: 'API',
    price: '$99',
    period: '/mo',
    description: 'For developers and algorithmic traders.',
    features: {
      assets: '5 assets (BTC, ETH, SOL, XRP, DOGE)',
      signals: 'Daily signals (8AM UTC)',
      direction: true,
      confidence: true,
      entryExit: true,
      multiTimeframe: true,
      backtestReport: true,
      notifications: 'Slack + Telegram + Webhook',
      history: 'Unlimited history',
      apiAccess: '1,000 req/day',
      webhooks: true,
      support: 'Dedicated support',
      sla: true,
    },
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: false,
    paid: true,
  },
];

const comparisonRows: { label: string; key: keyof typeof plans[0]['features'] }[] = [
  { label: 'Assets covered', key: 'assets' },
  { label: 'Signal delivery', key: 'signals' },
  { label: 'Direction (LONG/SHORT)', key: 'direction' },
  { label: 'Confidence score', key: 'confidence' },
  { label: 'Entry, Stop Loss, Take Profit', key: 'entryExit' },
  { label: 'Multi-timeframe (5m/10m/15m)', key: 'multiTimeframe' },
  { label: 'Backtest performance report', key: 'backtestReport' },
  { label: 'Notifications', key: 'notifications' },
  { label: 'Signal history', key: 'history' },
  { label: 'API access', key: 'apiAccess' },
  { label: 'Webhooks', key: 'webhooks' },
  { label: 'Support', key: 'support' },
  { label: 'SLA guarantee', key: 'sla' },
];

const faqs = [
  {
    question: 'What is Polymarket?',
    answer:
      'Polymarket is a decentralized prediction market platform where users can trade on the outcome of real-world events, including crypto price movements. You buy shares that pay out $1 if a prediction is correct and $0 if wrong. Our signals help you identify high-probability trades on Polymarket\'s crypto markets.',
  },
  {
    question: 'How accurate are the signals?',
    answer:
      'Our signals target a 2.5:1 risk:reward ratio — meaning for every $1 risked you aim to capture $2.50 in profit. Over our 90-day backtest across 1,200+ signals, this has produced a positive expected value per trade. Past performance does not guarantee future results. Signals are generated using RSI, MACD, and ATR-based analysis on Binance OHLCV data.',
  },
  {
    question: 'What prediction markets do the signals cover?',
    answer:
      'Signals cover the most liquid Polymarket crypto markets: BTC, ETH, SOL, XRP, and DOGE. For each asset, we provide signals across 5-minute, 10-minute, and 15-minute resolution markets — matching the most actively traded windows on Polymarket.',
  },
  {
    question: 'When are signals delivered?',
    answer:
      'Signals are generated and delivered every day at 8AM UTC. Basic and Pro subscribers receive signals via email. API subscribers can also pull the latest signals programmatically at any time. Signals are valid for the trading day and marked as expired after 24 hours.',
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer:
      'Yes. All plans can be cancelled anytime from your account dashboard. You will retain access until the end of your current billing period. There are no cancellation fees or lock-in contracts. We also offer a 7-day free trial on all plans so you can test before committing.',
  },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <svg className="w-5 h-5 text-emerald-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (value === false) {
    return (
      <svg className="w-5 h-5 text-gray-700 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  return <span className="text-sm text-gray-300 text-center block">{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-20 pb-14 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-medium tracking-wide uppercase mb-6">
              7-day free trial on all plans
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Simple, transparent pricing
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
              No hidden fees. No lock-in contracts. Start free, upgrade when you&apos;re ready.
            </p>
            {/* Trust badges */}
            <TrustBadges />
          </div>
        </section>

        {/* Bloomberg comparison callout */}
        <section className="pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-3 bg-gray-900/60 border border-gray-800 rounded-xl px-6 py-4 text-center max-w-3xl mx-auto">
              <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <p className="text-gray-300 text-sm">
                <span className="text-white font-semibold">vs. Bloomberg Terminal:</span>{' '}
                comparable market-data intelligence for{' '}
                <span className="text-emerald-400 font-semibold">$19–$99/mo</span>{' '}
                instead of{' '}
                <span className="text-gray-500 line-through">$1,000+/mo</span>{' '}
                — and ours is built specifically for Polymarket crypto prediction markets.
              </p>
            </div>
          </div>
        </section>

        {/* Plan cards with billing toggle */}
        <PricingPlans />

        {/* Comparison table */}
        <section className="py-16 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-10">
              Full feature comparison
            </h2>

            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/30">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400 w-1/3">
                      Feature
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan.name}
                        className={`py-4 px-6 text-center text-sm font-bold ${
                          plan.highlighted ? 'text-emerald-400' : 'text-white'
                        }`}
                      >
                        {plan.name}
                        <span className="block text-gray-500 font-normal text-xs mt-0.5">
                          {plan.price}{plan.period}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <tr
                      key={row.key}
                      className={`border-b border-gray-800/50 ${
                        index % 2 === 0 ? 'bg-transparent' : 'bg-gray-900/20'
                      }`}
                    >
                      <td className="py-3.5 px-6 text-sm text-gray-400">{row.label}</td>
                      {plans.map((plan) => (
                        <td key={plan.name} className="py-3.5 px-6">
                          <FeatureValue value={plan.features[row.key]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 border-t border-gray-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-10">
              Frequently asked questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                >
                  <h3 className="text-base font-semibold text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-gray-500 text-sm mb-4">
                Still have questions?
              </p>
              <a
                href="mailto:support@polymarketsignals.com"
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
              >
                Contact us at support@polymarketsignals.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
