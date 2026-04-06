import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'How to Read a Polymarket Signal | Polymarket Signals Guide',
  description: 'Learn exactly what each field in a Polymarket Signal means — direction, confidence, entry price, stop loss, take profit — and how to find the right Polymarket market to trade.',
  openGraph: {
    title: 'How to Read a Polymarket Signal',
    description: 'Direction, confidence score, entry price, stop loss, take profit — what every field means and how to map it to a Polymarket prediction market.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Read a Polymarket Signal: a practical guide',
  description: 'Learn exactly what each field in a Polymarket Signal means — direction, confidence, entry price, stop loss, take profit — and how to find the right Polymarket market to trade.',
  author: { '@type': 'Organization', name: 'Polymarket Signals' },
  publisher: { '@type': 'Organization', name: 'Polymarket Signals', logo: { '@type': 'ImageObject', url: 'https://polymarketsignals.com/icon-192.png' } },
  datePublished: '2026-04-06',
  dateModified: '2026-04-06',
};

export default function HowToReadSignalsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/guides" className="hover:text-gray-400 transition-colors">Guides</Link>
          <span>›</span>
          <span className="text-gray-400">How to read a Polymarket signal</span>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-3 uppercase tracking-wider">
            Beginner · 5 min read
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            How to Read a Polymarket Signal
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Each signal contains six fields. Together they tell you what to trade, how confident the system is,
            and where to set your risk levels. This guide explains every field using a real BTC signal as an example.
          </p>
        </div>

        <div className="space-y-8 text-gray-300">

          {/* Example signal */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Example: a real BTC LONG signal</h2>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 font-mono text-sm">
              <div className="space-y-2">
                {[
                  { key: 'Asset', value: 'BTC', color: 'text-orange-400' },
                  { key: 'Direction', value: 'LONG', color: 'text-emerald-400' },
                  { key: 'Confidence', value: '73%', color: 'text-white' },
                  { key: 'Entry Price', value: '$83,200', color: 'text-white' },
                  { key: 'Stop Loss', value: '$81,950 (−1.5%)', color: 'text-red-400' },
                  { key: 'Take Profit', value: '$86,325 (+3.75%)', color: 'text-emerald-400' },
                  { key: 'Timeframe', value: '15m', color: 'text-gray-400' },
                ].map((row) => (
                  <div key={row.key} className="flex items-center justify-between">
                    <span className="text-gray-500">{row.key}</span>
                    <span className={`font-bold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Field explanations */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What each field means</h2>
            <div className="space-y-4">
              {[
                {
                  field: 'Asset',
                  short: 'Which crypto is being analyzed',
                  detail: 'BTC, ETH, SOL, XRP, or DOGE. All signals are based on 15-minute OHLCV data from Binance. Match this to the prediction market on Polymarket — e.g., a BTC signal maps to any "Will BTC be above $X?" market.',
                },
                {
                  field: 'Direction: LONG or SHORT',
                  short: 'Which way to bet',
                  detail: 'LONG = the system expects price to rise. On Polymarket, this means buying YES on an above-threshold market (or NO on a below-threshold market). SHORT = buy NO on above-threshold (price expected to fall). LONG = low RSI (oversold). SHORT = high RSI (overbought).',
                },
                {
                  field: 'Confidence %',
                  short: 'How strongly the indicators agree',
                  detail: 'Ranges from 55% to 85%. This is NOT a win rate — it\'s an indicator alignment score. 55% = RSI alone triggered. 73% = RSI + MACD aligned. 82%+ = RSI + MACD + Bollinger Bands all agree. Filter signals by confidence to reduce risk: only trade 70%+ when starting out.',
                },
                {
                  field: 'Entry Price',
                  short: 'The market price at signal generation',
                  detail: 'Signals are generated at 8AM UTC. The entry price reflects the last trade price at that time. On Polymarket, entry price isn\'t directly used — instead, find a prediction market with a resolution threshold close to the entry price.',
                },
                {
                  field: 'Stop Loss',
                  short: 'Where to cut the trade if wrong',
                  detail: 'Set 1× ATR below entry (for LONG) or above entry (for SHORT). For spot/futures traders, this is your maximum acceptable loss level. For Polymarket traders, the stop loss helps you size positions — if the market reprices and you\'re down 1× ATR equivalent in probability, consider exiting.',
                },
                {
                  field: 'Take Profit',
                  short: 'Your price target if the signal is right',
                  detail: 'Set 2.5× ATR from entry, giving a 2.5:1 risk-reward ratio. For Polymarket, take profit isn\'t a hard sell — but if the market probability has moved significantly in your favor (e.g., from 40% to 65%), you can sell your shares for a profit before resolution.',
                },
              ].map((item) => (
                <div key={item.field} className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="font-semibold text-white text-sm">{item.field}</span>
                    <span className="text-xs text-gray-500 italic mt-0.5">{item.short}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Mapping a signal to a Polymarket market</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              This is where new users get confused. The signal gives you a direction and price level — but
              you need to find the right Polymarket market to trade. Here's how:
            </p>
            <ol className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Get your signal',
                  desc: 'Example: BTC LONG at $83,200, confidence 73%.',
                },
                {
                  step: 2,
                  title: 'Open Polymarket and filter by BTC',
                  desc: 'Go to Polymarket → Crypto → Bitcoin. Look for markets expiring within 24–72 hours.',
                },
                {
                  step: 3,
                  title: 'Find a threshold near the current price',
                  desc: 'Look for "Will BTC be above $84,000 on [today]?" or "above $85,000 this week?" — thresholds that are 1–3% above entry price for a LONG signal.',
                },
                {
                  step: 4,
                  title: 'Check the market price (YES shares)',
                  desc: 'If the market says YES = $0.42, the crowd thinks there\'s a 42% chance BTC hits $84k. If you believe 60% based on the LONG signal, buying YES at $0.42 gives you positive expected value.',
                },
                {
                  step: 5,
                  title: 'Size your position using the confidence score',
                  desc: 'Higher confidence = larger position. A 73% confidence signal might warrant 2–3% of your Polymarket bankroll. An 85% confidence signal might justify 5%. Never go all-in on a single trade.',
                },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <div>
                    <div className="font-semibold text-white text-sm mb-1">{item.title}</div>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Using the confidence score as a filter</h2>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/60">
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Confidence</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">What it means</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Recommended action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { range: '55–64%', meaning: 'RSI triggered, no confirmation', action: 'Small position or skip if new to trading' },
                    { range: '65–74%', meaning: 'RSI + MACD or Bollinger agree', action: 'Standard position (2–3% bankroll)' },
                    { range: '75–84%', meaning: 'RSI + MACD + Bollinger all agree', action: 'Larger position (4–5% bankroll)' },
                    { range: '85%', meaning: 'Maximum alignment', action: 'Strong conviction trade — still cap at 5–7%' },
                  ].map((row) => (
                    <tr key={row.range} className="border-b border-gray-800/50 last:border-0">
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400 text-xs">{row.range}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{row.meaning}</td>
                      <td className="px-4 py-3 text-gray-300 text-xs">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Common mistakes when reading signals</h2>
            <ul className="space-y-3">
              {[
                'Trading every signal regardless of confidence. Set a minimum confidence filter (65%+) in Settings → Notification Preferences.',
                'Waiting too long to enter. Signals are generated at 8AM UTC. Acting within 30–60 minutes gives you the best entry price before the market reprices.',
                'Using the entry price as the exact trade price. The entry price is a reference point — find a Polymarket market near that level, not exactly at it.',
                'Ignoring position sizing. Never bet more than 5–7% of your bankroll on a single signal, regardless of confidence.',
                'Holding through resolution when down significantly. If a LONG signal is wrong and the market probability drops from 55% to 25%, exit the trade — don\'t wait for resolution.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">See today's signals in action</h3>
            <p className="text-gray-400 text-sm mb-6">
              Access live signals for BTC, ETH, SOL, XRP, and DOGE with your 7-day free trial. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup" className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors">
                Start Free Trial
              </Link>
              <Link href="/preview" className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:text-white text-sm transition-colors">
                Preview signals →
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Learn more</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/guides/what-is-polymarket', label: 'What is Polymarket?', desc: 'How prediction markets work' },
                { href: '/guides/how-to-trade-polymarket-crypto', label: 'Full trading strategy guide', desc: 'Position sizing, timing, risk management' },
                { href: '/guides/best-polymarket-crypto-markets', label: 'Best markets to trade', desc: 'BTC vs ETH vs SOL comparison' },
                { href: '/faq', label: 'Frequently asked questions', desc: 'Common questions answered' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 hover:border-gray-700 transition-colors">
                  <div className="font-medium text-white text-sm mb-1">{item.label} →</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
