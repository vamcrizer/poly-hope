import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Polymarket Signals vs Alternatives | Best Crypto Prediction Market Signals',
  description: 'Compare Polymarket Signals with manual trading, generic crypto signals, and other tools. See why traders choose AI-powered Polymarket-specific signals.',
};

const features = [
  { name: 'Polymarket-specific signals', us: true, manual: false, generic: false },
  { name: 'Daily LONG/SHORT direction', us: true, manual: false, generic: true },
  { name: 'Entry, SL, TP levels', us: true, manual: false, generic: true },
  { name: 'RSI + MACD + ATR analysis', us: true, manual: false, generic: 'varies' },
  { name: 'Confidence score (55–85%)', us: true, manual: false, generic: false },
  { name: '5 assets (BTC/ETH/SOL/XRP/DOGE)', us: true, manual: false, generic: 'varies' },
  { name: 'Updated 8AM UTC daily', us: true, manual: false, generic: 'varies' },
  { name: 'Telegram alerts', us: true, manual: false, generic: 'paid' },
  { name: 'CSV export', us: true, manual: false, generic: false },
  { name: 'REST API access', us: true, manual: false, generic: false },
  { name: 'Webhook delivery', us: true, manual: false, generic: false },
  { name: '7-day free trial', us: true, manual: 'N/A', generic: false },
];

function Check({ val }: { val: boolean | string }) {
  if (val === true) return <span className="text-emerald-400 font-bold">✓</span>;
  if (val === false) return <span className="text-gray-600">✗</span>;
  if (val === 'N/A') return <span className="text-gray-500 text-xs">N/A</span>;
  return <span className="text-yellow-500 text-xs">{val}</span>;
}

const faqs = [
  {
    q: 'How is Polymarket Signals different from generic crypto signals?',
    a: 'Generic crypto signals are designed for spot/futures trading. Polymarket Signals are specifically designed for prediction markets — where you\'re betting on price levels at expiry, not running open positions. We optimize for Polymarket\'s binary outcome structure.',
  },
  {
    q: 'Can I use these signals on other platforms?',
    a: 'Yes. While our signals are optimized for Polymarket prediction markets, the LONG/SHORT direction, entry, stop loss, and take profit levels can be applied to any crypto trading platform.',
  },
  {
    q: 'What assets do you cover?',
    a: 'We cover the 5 most liquid crypto prediction markets on Polymarket: BTC, ETH, SOL, XRP, and DOGE. New assets are added based on Polymarket market availability.',
  },
  {
    q: 'How often are signals updated?',
    a: 'Signals are generated every morning at 8AM UTC using the latest 15-minute OHLCV data from Binance. One fresh set of signals per day.',
  },
  {
    q: 'What is the confidence score?',
    a: 'The confidence score (55–85%) is a normalized composite of RSI strength, MACD alignment, and Bollinger Band position. Higher confidence means more indicators agree on the direction.',
  },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            Why Polymarket Signals
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Polymarket Signals vs the alternatives
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            See how purpose-built Polymarket signals compare to manual analysis and generic crypto signal services.
          </p>
        </div>

        {/* Comparison table */}
        <div className="mb-16 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-gray-400 font-medium w-1/2">Feature</th>
                  <th className="px-4 py-4 text-center">
                    <div className="text-emerald-400 font-bold text-base">Polymarket Signals</div>
                    <div className="text-gray-500 text-xs font-normal mt-0.5">from $19/mo</div>
                  </th>
                  <th className="px-4 py-4 text-center">
                    <div className="text-gray-300 font-medium">Manual Analysis</div>
                    <div className="text-gray-500 text-xs font-normal mt-0.5">free · time-intensive</div>
                  </th>
                  <th className="px-4 py-4 text-center">
                    <div className="text-gray-300 font-medium">Generic Signals</div>
                    <div className="text-gray-500 text-xs font-normal mt-0.5">$20–100/mo</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr key={feature.name} className={`border-b border-gray-800/50 ${i % 2 === 0 ? 'bg-gray-900/20' : ''}`}>
                    <td className="px-6 py-3.5 text-gray-300">{feature.name}</td>
                    <td className="px-4 py-3.5 text-center"><Check val={feature.us} /></td>
                    <td className="px-4 py-3.5 text-center"><Check val={feature.manual} /></td>
                    <td className="px-4 py-3.5 text-center"><Check val={feature.generic} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key differentiators */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Built specifically for Polymarket</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Prediction market aware',
                desc: 'Our signals account for Polymarket\'s binary outcome structure — you\'re betting on price at expiry, not running a leveraged position.',
                icon: '🎯',
              },
              {
                title: 'Multi-indicator consensus',
                desc: 'RSI, MACD, and Bollinger Bands must agree before a signal fires. No single-indicator noise trades.',
                icon: '📊',
              },
              {
                title: 'Defined risk per trade',
                desc: 'Every signal comes with ATR-based stop loss and a 2.5:1 risk-reward take profit. Know your risk before you click.',
                icon: '🛡️',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Common questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-10">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to try the real thing?</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Start your 7-day free trial. No credit card required. Access all 5 assets from day one.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/preview"
              className="px-8 py-3 rounded-xl border border-gray-700 text-gray-300 hover:text-white transition-colors"
            >
              See a sample signal →
            </Link>
          </div>
          <p className="text-xs text-gray-600 mt-4">Cancel anytime · 7 days free · All plans include BTC/ETH/SOL/XRP/DOGE</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
