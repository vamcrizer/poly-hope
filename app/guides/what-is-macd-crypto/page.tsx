import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'What is MACD in Crypto Trading? | Polymarket Signals Guide',
  description: 'Learn how the MACD indicator works in crypto trading. Understand bullish/bearish crossovers, MACD divergence, and how MACD confirms RSI signals for higher-confidence trades.',
  openGraph: {
    title: 'What is MACD in Crypto Trading?',
    description: 'Complete guide to MACD for crypto traders — how it works, crossovers, histogram, and how MACD boosts signal confidence in Polymarket trading.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What is MACD in Crypto Trading? | Polymarket Signals Guide',
  description: 'Learn how the MACD indicator works in crypto trading. Understand bullish/bearish crossovers, MACD divergence, and how MACD confirms RSI signals for higher-confidence trades.',
  author: { '@type': 'Organization', name: 'Polymarket Signals' },
  publisher: { '@type': 'Organization', name: 'Polymarket Signals', logo: { '@type': 'ImageObject', url: 'https://polymarketsignals.com/icon-192.png' } },
  datePublished: '2026-04-06',
  dateModified: '2026-04-06',
};

export default function MacdGuidePage() {
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
          <span className="text-gray-400">What is MACD in crypto trading</span>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-3 uppercase tracking-wider">
            Technical Analysis · 7 min read
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            What is MACD in Crypto Trading?
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            The Moving Average Convergence Divergence (MACD) is a momentum indicator that shows the relationship
            between two moving averages of a price. It's used to identify trend direction, momentum strength,
            and potential reversals — making it one of the most useful confirmation tools in a signal system.
          </p>
        </div>

        <div className="space-y-8 text-gray-300">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How MACD is calculated</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              MACD is built from three components:
            </p>
            <div className="space-y-3">
              {[
                { name: 'MACD Line', formula: 'EMA(12) − EMA(26)', desc: 'The difference between a 12-period and 26-period Exponential Moving Average. When positive, short-term price is above long-term price (bullish momentum).' },
                { name: 'Signal Line', formula: 'EMA(9) of MACD Line', desc: 'A 9-period EMA smoothed over the MACD Line. Used to generate crossover signals.' },
                { name: 'Histogram', formula: 'MACD Line − Signal Line', desc: 'The gap between MACD and Signal. Positive = bullish momentum building; Negative = bearish momentum building.' },
              ].map((item) => (
                <div key={item.name} className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">{item.name}</span>
                    <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{item.formula}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Bullish vs bearish MACD</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="text-emerald-400 font-bold text-sm mb-2">Bullish MACD</div>
                <ul className="space-y-1.5 text-xs text-gray-400">
                  <li>→ MACD Line is above zero (EMA12 &gt; EMA26)</li>
                  <li>→ MACD Line crosses above Signal Line</li>
                  <li>→ Histogram turns positive (green bars)</li>
                  <li>→ Short-term momentum is up</li>
                </ul>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                <div className="text-red-400 font-bold text-sm mb-2">Bearish MACD</div>
                <ul className="space-y-1.5 text-xs text-gray-400">
                  <li>→ MACD Line is below zero (EMA12 &lt; EMA26)</li>
                  <li>→ MACD Line crosses below Signal Line</li>
                  <li>→ Histogram turns negative (red bars)</li>
                  <li>→ Short-term momentum is down</li>
                </ul>
              </div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <p className="text-sm text-gray-400">
                <strong className="text-gray-300">How Polymarket Signals uses MACD:</strong> We check whether MACD
                is bullish or bearish as a confirmation filter. If RSI shows oversold (LONG) and MACD is also
                bullish, the signal gets a +3% confidence boost. This reduces false signals during counter-trend moves.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">MACD crossovers</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              The most watched MACD event is when the MACD Line crosses the Signal Line:
            </p>
            <ul className="space-y-3 text-sm">
              {[
                { event: 'Bullish crossover', desc: 'MACD Line crosses above the Signal Line. Often used as a buy signal. Most reliable when it happens below zero.' },
                { event: 'Bearish crossover', desc: 'MACD Line crosses below the Signal Line. Often used as a sell/short signal. Most reliable when it happens above zero.' },
                { event: 'Zero line cross (bullish)', desc: 'MACD Line moves from negative to positive. Signals a regime change from short-term bearish to bullish momentum.' },
                { event: 'Zero line cross (bearish)', desc: 'MACD Line moves from positive to negative. Signals momentum shift from bullish to bearish.' },
              ].map((item) => (
                <li key={item.event} className="flex items-start gap-3 rounded-lg border border-gray-800 bg-gray-900/30 p-3">
                  <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
                  <div>
                    <div className="font-medium text-gray-300 mb-0.5">{item.event}</div>
                    <div className="text-gray-500 text-xs">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">MACD divergence</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Divergence is when price moves in one direction but MACD moves in the opposite direction.
              This often precedes reversals:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="text-emerald-400 font-semibold text-sm mb-2">Bullish divergence</div>
                <p className="text-xs text-gray-400">
                  Price makes a new low, but MACD makes a higher low. Momentum is slowing on the downside.
                  Often precedes a bounce or reversal. Combines well with RSI oversold signals.
                </p>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <div className="text-red-400 font-semibold text-sm mb-2">Bearish divergence</div>
                <p className="text-xs text-gray-400">
                  Price makes a new high, but MACD makes a lower high. Upward momentum is weakening.
                  Often precedes a pullback. Combines well with RSI overbought signals.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">MACD vs RSI: how they work together</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              RSI and MACD measure different things and complement each other:
            </p>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/60">
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Indicator</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Measures</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Best for</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ind: 'RSI', meas: 'Speed of price change', best: 'Identifying overbought/oversold extremes' },
                    { ind: 'MACD', meas: 'Direction of momentum', best: 'Confirming trend and crossovers' },
                    { ind: 'Both', meas: 'Momentum agreement', best: 'High-confidence signal generation' },
                  ].map((row) => (
                    <tr key={row.ind} className="border-b border-gray-800/50 last:border-0">
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400 text-xs">{row.ind}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{row.meas}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{row.best}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Common MACD mistakes</h2>
            <ul className="space-y-3">
              {[
                'Using MACD alone. It lags price and works best as a confirmation tool alongside RSI or price action.',
                'Treating every crossover as a trade. On noisy short timeframes (1m, 5m), there are dozens of false crossovers per day.',
                'Ignoring the zero line. A bullish crossover below zero is weaker than one above zero — the trend context matters.',
                'Not adjusting for timeframe. Standard 12/26/9 settings work well on 15m+ charts. Shorter timeframes may need tuning.',
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
            <h3 className="text-xl font-bold text-white mb-2">Get RSI + MACD signals daily</h3>
            <p className="text-gray-400 text-sm mb-6">
              We combine RSI, MACD, and Bollinger Bands into one confidence score for BTC, ETH, SOL, XRP, and DOGE.
            </p>
            <Link
              href="/signup"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
            >
              Start Free Trial
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">More guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/guides/what-is-rsi-crypto', label: 'What is RSI in crypto trading?', desc: 'The RSI indicator explained' },
                { href: '/guides/how-to-trade-polymarket-crypto', label: 'How to trade Polymarket crypto', desc: 'Full trading strategy guide' },
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
