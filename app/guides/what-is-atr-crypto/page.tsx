import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'What is ATR in Crypto Trading? | Polymarket Signals Guide',
  description: 'Learn how Average True Range (ATR) measures volatility in crypto markets. Understand how to use ATR for stop loss and take profit placement, and why 2.5:1 risk-reward works.',
  openGraph: {
    title: 'What is ATR in Crypto Trading?',
    description: 'ATR explained for crypto traders — volatility measurement, stop loss placement, take profit targets, and why risk-reward ratio matters more than win rate.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What is ATR in Crypto Trading? | Polymarket Signals Guide',
  description: 'Learn how Average True Range (ATR) measures volatility in crypto markets. Understand how to use ATR for stop loss and take profit placement, and why 2.5:1 risk-reward works.',
  author: { '@type': 'Organization', name: 'Polymarket Signals' },
  publisher: { '@type': 'Organization', name: 'Polymarket Signals', logo: { '@type': 'ImageObject', url: 'https://polymarketsignals.com/icon-192.png' } },
  datePublished: '2026-04-06',
  dateModified: '2026-04-06',
};

export default function AtrGuidePage() {
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
          <span className="text-gray-400">What is ATR in crypto trading</span>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-3 uppercase tracking-wider">
            Technical Analysis · 6 min read
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            What is ATR in Crypto Trading?
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Average True Range (ATR) is a volatility indicator that measures how much an asset typically moves
            over a given period. Unlike RSI or MACD, ATR doesn't tell you direction — it tells you how far
            the price is likely to move. This makes it essential for setting stop losses and take profit targets.
          </p>
        </div>

        <div className="space-y-8 text-gray-300">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How ATR is calculated</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              ATR starts with the "True Range" of each candle — the largest of these three values:
            </p>
            <ul className="space-y-2 text-sm text-gray-400 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 shrink-0">1.</span>
                <span>Current high minus current low (the candle's range)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 shrink-0">2.</span>
                <span>|Current high minus previous close| (gap-up scenario)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 shrink-0">3.</span>
                <span>|Current low minus previous close| (gap-down scenario)</span>
              </li>
            </ul>
            <p className="text-gray-400 leading-relaxed">
              ATR is then the average of True Range over the last N periods (typically 14). A higher ATR means
              the market is more volatile. A lower ATR means it's calmer. ATR is always positive — it measures
              the size of moves, not direction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">ATR and volatility regimes</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              ATR changes dramatically between calm and volatile crypto markets:
            </p>
            <div className="space-y-3">
              {[
                { regime: 'Low ATR (calm market)', example: 'BTC: ~$300 ATR on 15m', desc: 'Price moves slowly. Tight ranges. Stop losses can be set closer to entry. Lower risk per trade.' },
                { regime: 'High ATR (volatile market)', example: 'BTC: ~$1,200 ATR on 15m', desc: 'Price moves fast. Wide swings. Stop losses must be set further out or you\'ll get stopped out by noise.' },
                { regime: 'ATR spike (news/event)', example: 'BTC: ATR spikes 3–5×', desc: 'Usually around major events (CPI, Fed, exchange hacks). Signals become riskier — reduce position size.' },
              ].map((item) => (
                <div key={item.regime} className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-semibold text-white text-sm">{item.regime}</span>
                    <span className="font-mono text-xs text-gray-500">{item.example}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How ATR sets stop loss and take profit</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              ATR-based stop losses and take profits automatically adapt to current volatility.
              In volatile markets they widen; in calm markets they tighten.
            </p>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 mb-4">
              <div className="text-sm font-semibold text-emerald-300 mb-3">How Polymarket Signals uses ATR</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 w-20 shrink-0">Entry</span>
                  <span className="text-gray-300 font-mono">Current market price</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 w-20 shrink-0">Stop Loss</span>
                  <span className="text-gray-300 font-mono">Entry ± 1× ATR</span>
                  <span className="text-xs text-gray-600">(below for LONG, above for SHORT)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 w-20 shrink-0">Take Profit</span>
                  <span className="text-gray-300 font-mono">Entry ± 2.5× ATR</span>
                  <span className="text-xs text-gray-600">(above for LONG, below for SHORT)</span>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-emerald-500/20">
                  <span className="text-gray-500 w-20 shrink-0">Risk:Reward</span>
                  <span className="text-emerald-400 font-mono font-bold">2.5:1</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <div className="text-sm font-semibold text-white mb-2">Example — BTC LONG signal</div>
              <div className="space-y-1.5 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">ATR (15m)</span>
                  <span className="text-gray-300">$1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Entry</span>
                  <span className="text-gray-300">$83,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stop Loss (1× ATR below)</span>
                  <span className="text-red-400">$81,950</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Take Profit (2.5× ATR above)</span>
                  <span className="text-emerald-400">$86,325</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-700">
                  <span className="text-gray-500">Risk</span>
                  <span className="text-gray-300">$1,250 (1.5%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reward</span>
                  <span className="text-gray-300">$3,125 (3.75%)</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Why risk-reward ratio matters more than win rate</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Many traders obsess over win rate. But with a 2.5:1 risk-reward, you only need to be right 29%
              of the time to break even. Here's the math:
            </p>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/60">
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Win Rate</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Loss Rate</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">P&L per 10 trades (2.5:1 RR)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { win: '30%', loss: '70%', pnl: '+7.5 − 7 = +0.5R', color: 'text-emerald-400' },
                    { win: '40%', loss: '60%', pnl: '+10 − 6 = +4R', color: 'text-emerald-400' },
                    { win: '50%', loss: '50%', pnl: '+12.5 − 5 = +7.5R', color: 'text-emerald-400' },
                    { win: '25%', loss: '75%', pnl: '+6.25 − 7.5 = −1.25R', color: 'text-red-400' },
                  ].map((row) => (
                    <tr key={row.win} className="border-b border-gray-800/50 last:border-0">
                      <td className="px-4 py-3 text-gray-300">{row.win}</td>
                      <td className="px-4 py-3 text-gray-500">{row.loss}</td>
                      <td className={`px-4 py-3 font-mono font-semibold ${row.color}`}>{row.pnl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs mt-2">R = 1 unit of risk. A 2.5:1 system is profitable with as few as 29% wins.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">ATR and position sizing</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Use ATR to calculate position size so you risk the same dollar amount per trade regardless of
              which asset you're trading:
            </p>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="text-sm font-semibold text-emerald-300 mb-2">Position sizing formula</div>
              <div className="font-mono text-sm text-gray-300 space-y-1">
                <div>risk_per_trade = account × risk_pct</div>
                <div>position_size = risk_per_trade / (1× ATR)</div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Example: $10,000 account, 2% risk = $200. BTC ATR = $1,250.
                Position = $200 / $1,250 = 0.16 BTC worth of exposure.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Get ATR-based signals delivered daily</h3>
            <p className="text-gray-400 text-sm mb-6">
              Every signal includes ATR-calibrated stop loss and 2.5:1 take profit.
              Start your 7-day free trial.
            </p>
            <Link href="/signup" className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors">
              Start Free Trial
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Complete the indicator series</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/guides/what-is-rsi-crypto', label: 'What is RSI?', desc: 'Oversold/overbought levels explained' },
                { href: '/guides/what-is-macd-crypto', label: 'What is MACD?', desc: 'Momentum and crossovers explained' },
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
