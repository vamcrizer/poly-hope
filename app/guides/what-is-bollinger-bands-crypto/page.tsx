import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'What are Bollinger Bands in Crypto Trading? | Polymarket Signals Guide',
  description: 'Learn how Bollinger Bands work in crypto. Understand band squeezes, breakouts, and how Bollinger Band position confirms RSI signals for higher-confidence trades.',
  openGraph: {
    title: 'What are Bollinger Bands in Crypto Trading?',
    description: 'Complete guide to Bollinger Bands for crypto traders — band width, price position, squeezes, and how BB position boosts signal confidence.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What are Bollinger Bands in Crypto Trading? | Polymarket Signals Guide',
  description: 'Learn how Bollinger Bands work in crypto. Understand band squeezes, breakouts, and how Bollinger Band position confirms RSI signals for higher-confidence trades.',
  author: { '@type': 'Organization', name: 'Polymarket Signals' },
  publisher: { '@type': 'Organization', name: 'Polymarket Signals', logo: { '@type': 'ImageObject', url: 'https://polymarketsignals.com/icon-192.png' } },
  datePublished: '2026-04-06',
  dateModified: '2026-04-06',
};

export default function BollingerBandsGuidePage() {
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
          <span className="text-gray-400">What are Bollinger Bands in crypto</span>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-3 uppercase tracking-wider">
            Technical Analysis · 6 min read
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            What are Bollinger Bands in Crypto Trading?
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Bollinger Bands are a volatility indicator that draws a dynamic channel around price using a moving
            average and standard deviation. The bands contract when markets are quiet and expand when they're
            volatile. Where price sits within the bands tells you about relative strength — and helps confirm
            whether an oversold RSI signal is near support or not.
          </p>
        </div>

        <div className="space-y-8 text-gray-300">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How Bollinger Bands are calculated</h2>
            <div className="space-y-3">
              {[
                { name: 'Middle Band', formula: 'SMA(20)', desc: '20-period Simple Moving Average of closing prices. Acts as the baseline/mean.' },
                { name: 'Upper Band', formula: 'SMA(20) + 2σ', desc: '2 standard deviations above the middle band. Statistically contains ~95% of price action.' },
                { name: 'Lower Band', formula: 'SMA(20) − 2σ', desc: '2 standard deviations below the middle band. Price near this level is statistically extended to the downside.' },
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
            <p className="text-gray-400 text-sm mt-4">
              Standard deviation (σ) measures how much recent prices deviate from the average.
              High σ = wide bands = volatile market. Low σ = narrow bands = quiet market.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What price position within the bands means</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              The key signal from Bollinger Bands is where price is <em>within</em> the band, expressed as a 0–1 scale:
            </p>
            <div className="space-y-3">
              {[
                { pos: '0–0.25 (near lower band)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', desc: 'Price is near the lower band — statistically oversold relative to recent volatility. Supports LONG signals. Polymarket Signals adds +2% confidence.' },
                { pos: '0.25–0.75 (mid-band)', color: 'text-gray-300', bg: 'bg-gray-800/60 border-gray-700/40', desc: 'Price is in the middle of the range. Neutral — no bonus. Watch for direction confirmation from RSI and MACD.' },
                { pos: '0.75–1.0 (near upper band)', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', desc: 'Price is near the upper band — statistically overbought relative to recent volatility. Supports SHORT signals. Polymarket Signals adds +2% confidence.' },
              ].map((item) => (
                <div key={item.pos} className={`rounded-xl border ${item.bg} p-4`}>
                  <div className={`font-semibold text-sm mb-1 ${item.color}`}>{item.pos}</div>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">The Bollinger Band squeeze</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              A "squeeze" happens when the bands narrow dramatically — standard deviation drops as volatility compresses.
              This typically precedes a major breakout in either direction.
            </p>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <div className="text-sm font-semibold text-white mb-2">How to trade a squeeze</div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
                  <span>Wait for bands to narrow (squeeze builds)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
                  <span>Watch for RSI to break out of neutral zone (above 55 or below 45)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
                  <span>Wait for a candle to close outside the band — that confirms the breakout direction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
                  <span>On Polymarket, look for a threshold market in the direction of the breakout</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Bollinger Bands in the confidence score</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Our signal confidence is built from three indicators. Bollinger Band position is the third layer:
            </p>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/60">
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Indicator</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Role</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Confidence boost</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ind: 'RSI', role: 'Primary signal trigger (direction)', boost: 'Base confidence: 55–85%' },
                    { ind: 'MACD', role: 'Momentum confirmation', boost: '+3% if MACD agrees' },
                    { ind: 'Bollinger Bands', role: 'Position confirmation', boost: '+2% if near matching band' },
                  ].map((row) => (
                    <tr key={row.ind} className="border-b border-gray-800/50 last:border-0">
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400 text-xs">{row.ind}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{row.role}</td>
                      <td className="px-4 py-3 text-gray-300 text-xs font-medium">{row.boost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs mt-2">Maximum confidence is capped at 85% to prevent overconfidence.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Common Bollinger Band mistakes</h2>
            <ul className="space-y-3">
              {[
                'Selling at the upper band blindly. In a strong uptrend, price can "walk the upper band" — riding it higher for many candles.',
                'Buying at the lower band without RSI confirmation. In a downtrend, price can walk the lower band continuously.',
                'Ignoring the squeeze. The most powerful moves come out of squeezes. Don\'t trade within tight bands.',
                'Using default settings for all timeframes. 20-period works well for 15m and above; shorter timeframes may need period adjustment.',
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
            <h3 className="text-xl font-bold text-white mb-2">All 4 indicators. One confidence score.</h3>
            <p className="text-gray-400 text-sm mb-6">
              RSI + MACD + Bollinger Bands + ATR — combined into one daily signal for BTC, ETH, SOL, XRP, and DOGE.
            </p>
            <Link href="/signup" className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors">
              Start Free Trial
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Complete the indicator series</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { href: '/guides/what-is-rsi-crypto', label: 'RSI', desc: 'Oversold/overbought' },
                { href: '/guides/what-is-macd-crypto', label: 'MACD', desc: 'Momentum & crossovers' },
                { href: '/guides/what-is-atr-crypto', label: 'ATR', desc: 'Stop loss & take profit' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 hover:border-gray-700 transition-colors text-center">
                  <div className="font-mono font-bold text-emerald-400 text-base mb-1">{item.label}</div>
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
