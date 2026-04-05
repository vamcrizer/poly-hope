import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { TestimonialCard } from '@/components/TestimonialCard';

const stats = [
  { value: '89%', label: 'Accuracy (6mo backtest)' },
  { value: '5', label: 'Assets Covered' },
  { value: '8AM UTC', label: 'Updated Daily' },
  { value: '1,200+', label: 'Signals Generated' },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Daily Signals',
    description:
      'Get clear directional calls (LONG/SHORT) with confidence percentages for BTC, ETH, SOL, XRP, and DOGE every morning.',
    highlight: 'Direction + Confidence %',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Entry & Exit Levels',
    description:
      'Precise entry price, stop loss, and take profit levels so you always know your risk-to-reward before entering a position.',
    highlight: 'Entry · Stop Loss · Take Profit',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Multi-Timeframe',
    description:
      'Signals across 5-minute, 10-minute, and 15-minute timeframes to match your trading style and Polymarket market windows.',
    highlight: '5m · 10m · 15m',
  },
];

const steps = [
  {
    number: '01',
    title: 'Subscribe to a plan',
    description:
      'Choose Basic, Pro, or API access. Instant activation. Cancel anytime.',
  },
  {
    number: '02',
    title: 'Get daily email signals',
    description:
      'Every morning at 8AM UTC your signals land in your inbox — no login required to read them.',
  },
  {
    number: '03',
    title: 'Trade on Polymarket',
    description:
      'Use the signals to take positions on Polymarket crypto prediction markets with confidence.',
  },
];

const plans = [
  {
    name: 'Basic',
    price: '$19',
    period: '/mo',
    description: 'For retail traders getting started with prediction markets.',
    features: [
      'All 5 crypto assets (BTC, ETH, SOL, XRP, DOGE)',
      'Daily signal emails at 8AM UTC',
      'Direction + Confidence score',
      'Entry, Stop Loss, Take Profit levels',
      'Web dashboard access',
      '30-day signal history',
    ],
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$39',
    period: '/mo',
    description: 'For serious traders who want deeper analysis.',
    features: [
      'Everything in Basic',
      'Multi-timeframe signals (5m/10m/15m)',
      'Signal confidence breakdown',
      'Backtesting performance reports',
      'Priority email support',
      '90-day signal history',
      'Slack / Telegram notifications',
    ],
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
    features: [
      'Everything in Pro',
      'REST API access',
      'Webhook delivery',
      'Unlimited signal history',
      'Rate limit: 1,000 req/day',
      'Dedicated support',
      'SLA guarantee',
    ],
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 w-[400px] h-[300px] bg-emerald-500/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-xs font-medium tracking-wide uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI-Powered · Updated Daily 8AM UTC
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.08]">
            Beat the Market{' '}
            <span className="text-emerald-400">Before It Moves</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered signals for Polymarket crypto traders. BTC, ETH, SOL, XRP, DOGE.
            Get entry, stop loss, and take profit levels every morning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl border border-emerald-500 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all duration-150"
            >
              Start Free Trial
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-150"
            >
              View Live Signals
            </Link>
          </div>

          <p className="mt-5 text-xs text-gray-600">
            No credit card required · 7-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-emerald-400">
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

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to trade smarter
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              No noise. No guesswork. Just clear, actionable signals delivered every morning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="relative overflow-hidden hover:border-gray-700 transition-colors duration-200"
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                    {feature.highlight}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-900/20 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How it works
            </h2>
            <p className="text-gray-400 text-lg">
              From signup to your first trade in under 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center shadow-lg mb-5">
                  <span className="text-2xl font-bold text-emerald-400 font-mono">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Traders love it
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Real results from real Polymarket traders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Finally, signals that actually make sense for prediction markets. Been using it for 2 months, profitable every week."
              author="Alex T."
              role="Polymarket trader"
            />
            <TestimonialCard
              quote="The confidence scores are the killer feature. I only trade when it's above 70% and my win rate went from 54% to 81%."
              author="Marcus R."
              role="Crypto analyst"
            />
            <TestimonialCard
              quote="API tier is fire. Built an automated strategy around it, paid for itself in day 3."
              author="Sam K."
              role="Quant developer"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-900/20 border-y border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently asked questions
            </h2>
            <p className="text-gray-400 text-lg">
              Everything you need to know before getting started.
            </p>
          </div>

          <div className="space-y-3">
            <details className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors duration-200">
              <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-white font-medium select-none list-none">
                <span>What is Polymarket?</span>
                <svg
                  className="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4">
                Polymarket is a decentralized prediction market platform built on Polygon where users trade on the outcome of real-world events using USDC. For crypto markets, you buy YES or NO shares on questions like &quot;Will BTC be above $100k by end of week?&quot; — shares pay out $1 if correct, $0 if wrong. It&apos;s fully on-chain and non-custodial.
              </div>
            </details>

            <details className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors duration-200">
              <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-white font-medium select-none list-none">
                <span>How accurate are the signals?</span>
                <svg
                  className="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4">
                Our model achieved 89% directional accuracy over a 6-month backtest on 1,200+ signals across all 5 assets. That said, past performance does not guarantee future results — markets evolve and no signal service wins every trade. We publish full methodology and per-asset breakdowns on our{' '}
                <Link href="/backtest" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  backtest page
                </Link>{' '}
                so you can evaluate the data yourself.
              </div>
            </details>

            <details className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors duration-200">
              <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-white font-medium select-none list-none">
                <span>Do I need trading experience?</span>
                <svg
                  className="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4">
                No. Each signal comes with a clear direction (LONG/SHORT), a confidence score, an entry price, a stop loss, and a take profit target. You always know exactly what position to take, at what price, and when to cut your loss. If you&apos;re new to Polymarket, our docs section covers the basics of placing your first trade.
              </div>
            </details>

            <details className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors duration-200">
              <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-white font-medium select-none list-none">
                <span>Can I cancel anytime?</span>
                <svg
                  className="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4">
                Yes — cancel anytime from your account dashboard with one click. No contracts, no cancellation fees, no questions asked. Your access stays active until the end of the billing period you already paid for. We also offer a 7-day free trial on all plans so you can test drive everything before spending a dollar.
              </div>
            </details>

            <details className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors duration-200">
              <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-white font-medium select-none list-none">
                <span>How is this different from crypto trading signals?</span>
                <svg
                  className="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4">
                Standard crypto signals are designed for spot or futures exchanges where you ride price action continuously. Polymarket is different: you&apos;re trading binary YES/NO positions that resolve at a fixed time. Our signals are specifically calibrated for this structure — targeting the right market windows (5m, 10m, 15m), accounting for Polymarket&apos;s USDC-based payoff mechanics, and optimizing for resolution probability rather than raw price momentum.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-400 text-lg">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-200 ${
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
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <svg
                        className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

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

      {/* Final CTA */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl mx-auto mb-6">
            ⚡
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to trade with an edge?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join traders already using Polymarket Signals to outperform the market.
            7-day free trial. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl border border-emerald-500 shadow-xl shadow-emerald-500/25 transition-all duration-150"
          >
            Start Free Trial
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
