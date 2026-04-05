import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

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
      'Our signals have achieved 89% directional accuracy over a 6-month backtest period across all 5 assets. Past performance does not guarantee future results. Signals are generated using a proprietary AI model trained on order flow, funding rates, on-chain data, and market microstructure patterns.',
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
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              No hidden fees. No lock-in contracts. Start free, upgrade when you&apos;re ready.
            </p>
          </div>
        </section>

        {/* Plan cards */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-7 flex flex-col transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-gray-900 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/20'
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg shadow-emerald-500/30">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
                    <p className="text-gray-500 text-sm">{plan.description}</p>
                  </div>

                  <div className="mb-7">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-500 text-sm">{plan.period}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Billed monthly. Cancel anytime.</p>
                  </div>

                  <Link
                    href={plan.href}
                    className={`w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      plan.highlighted
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500 shadow-lg shadow-emerald-500/25'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

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
