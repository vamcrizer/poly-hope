import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'What is RSI in Crypto Trading? | Polymarket Signals Guide',
  description: 'Learn how the Relative Strength Index (RSI) works in crypto trading. Understand oversold/overbought levels, RSI divergence, and how to use RSI for Polymarket prediction markets.',
  openGraph: {
    title: 'What is RSI in Crypto Trading?',
    description: 'Complete guide to the RSI indicator for crypto traders — how it works, what overbought/oversold means, and how RSI generates LONG/SHORT signals.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What is RSI in Crypto Trading? | Polymarket Signals Guide',
  description: 'Learn how the Relative Strength Index (RSI) works in crypto trading. Understand oversold/overbought levels, RSI divergence, and how to use RSI for Polymarket prediction markets.',
  author: { '@type': 'Organization', name: 'Polymarket Signals' },
  publisher: { '@type': 'Organization', name: 'Polymarket Signals', logo: { '@type': 'ImageObject', url: 'https://polymarketsignals.com/icon-192.png' } },
  datePublished: '2026-04-06',
  dateModified: '2026-04-06',
};

export default function RsiGuidePagePage() {
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
          <span className="text-gray-400">What is RSI in crypto trading</span>
        </div>

        {/* Article header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-3 uppercase tracking-wider">
            Technical Analysis · 6 min read
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            What is RSI in Crypto Trading?
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            The Relative Strength Index (RSI) is one of the most widely used momentum indicators in technical
            analysis. It measures how fast and how much a price has moved recently, helping you identify when
            an asset is overbought or oversold — and likely to reverse.
          </p>
        </div>

        <div className="space-y-8 text-gray-300">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How RSI is calculated</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              RSI is calculated over a rolling period (typically 14 candles). For each candle, you look at whether
              the price closed higher or lower than the previous candle:
            </p>
            <ul className="space-y-2 text-sm text-gray-400 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 shrink-0">→</span>
                <span>Sum up all "up" candle gains over the last 14 periods (average gain)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 shrink-0">→</span>
                <span>Sum up all "down" candle losses over the last 14 periods (average loss)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 shrink-0">→</span>
                <span>RSI = 100 − (100 / (1 + (avg gain / avg loss)))</span>
              </li>
            </ul>
            <p className="text-gray-400 leading-relaxed">
              The result is a number between 0 and 100. The higher the RSI, the more recent candles have been
              closing up. The lower the RSI, the more recent candles have been closing down.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What do RSI levels mean?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { range: '0–30', label: 'Oversold', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', desc: 'Price has dropped too fast. Mean reversion (bounce) likely. LONG signal territory.' },
                { range: '40–60', label: 'Neutral', color: 'text-gray-300', bg: 'bg-gray-800/60 border-gray-700/40', desc: 'No clear signal. Polymarket Signals skips this zone to avoid false signals.' },
                { range: '70–100', label: 'Overbought', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', desc: 'Price has risen too fast. Pullback likely. SHORT signal territory.' },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl border ${item.bg} p-4`}>
                  <div className={`text-2xl font-bold font-mono mb-1 ${item.color}`}>{item.range}</div>
                  <div className={`text-sm font-semibold mb-2 ${item.color}`}>{item.label}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <p className="text-sm text-gray-400">
                <strong className="text-gray-300">How Polymarket Signals uses RSI:</strong> We fire a LONG signal when
                RSI drops below 35 (strongly oversold). We fire a SHORT signal when RSI rises above 65 (strongly
                overbought). The 35/65 thresholds filter out weaker signals — only act on clear extremes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">RSI and the confidence score</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Not all RSI extremes are equal. An RSI of 20 is a much stronger signal than an RSI of 33.
              Our confidence score accounts for this:
            </p>
            <ul className="space-y-3 text-sm">
              {[
                { rsi: 'RSI = 33', dir: 'LONG', conf: '~55%', note: 'Just over threshold. Weak signal.' },
                { rsi: 'RSI = 25', dir: 'LONG', conf: '~68%', note: 'Deeper oversold. Stronger signal.' },
                { rsi: 'RSI = 15', dir: 'LONG', conf: '~80%', note: 'Very deep oversold. Strong signal.' },
              ].map((item) => (
                <li key={item.rsi} className="flex items-start gap-3 rounded-lg border border-gray-800 bg-gray-900/30 p-3">
                  <span className="font-mono text-emerald-400 text-xs mt-0.5 shrink-0 w-16">{item.rsi}</span>
                  <span className="text-gray-400 flex-1">{item.note}</span>
                  <span className="font-mono text-xs text-gray-300 shrink-0">{item.conf}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-sm mt-4">
              The confidence is also boosted when MACD and Bollinger Bands agree with the RSI direction —
              giving higher confidence only when multiple indicators align.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">RSI on different timeframes</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              RSI behaves differently depending on the chart timeframe:
            </p>
            <div className="space-y-3">
              {[
                { tf: '5-minute', use: 'Short-term scalping. Lots of false signals. Use only with confirmation.' },
                { tf: '15-minute', use: 'Our primary timeframe. Good balance of signal frequency and reliability.' },
                { tf: '1-hour', use: 'Fewer signals, but more reliable for multi-hour prediction market windows.' },
                { tf: 'Daily', use: 'Best for week-long Polymarket markets. Fewer but highest quality signals.' },
              ].map((row) => (
                <div key={row.tf} className="flex items-start gap-4 rounded-xl border border-gray-800 bg-gray-900/30 p-4">
                  <span className="font-mono text-xs text-gray-300 w-20 shrink-0 mt-0.5">{row.tf}</span>
                  <span className="text-sm text-gray-400">{row.use}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Common RSI mistakes in crypto</h2>
            <ul className="space-y-3">
              {[
                'Treating RSI = 30 as a guaranteed buy. In strong downtrends, RSI can stay below 30 for extended periods.',
                'Using RSI alone. Always combine with trend direction (MACD) and volatility (ATR) for confirmation.',
                'Confusing timeframes. A 15m RSI of 20 doesn\'t mean the 4h RSI is oversold.',
                'Ignoring divergence. When price makes a new low but RSI makes a higher low, that\'s bullish divergence — a potential reversal.',
                'Over-optimizing thresholds. Using 25/75 instead of 30/70 may improve backtest results but overfits historical data.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Applying RSI to Polymarket trades</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              On Polymarket, most markets expire in 24–72 hours. RSI on a 15-minute chart captures intraday
              momentum shifts that can move prices 3–8% within that window — enough to cross a market threshold.
            </p>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="text-sm font-semibold text-emerald-300 mb-2">Example trade</div>
              <p className="text-sm text-gray-400">
                BTC is at $82,500. There's a Polymarket market: "BTC above $84,000 by 8PM UTC" at 35% YES.
                Our signal shows RSI = 22 (LONG, confidence 74%). You expect BTC to bounce — the market is
                mispriced at 35% when you estimate 55%+ probability. Buy YES at $0.35, exit if BTC approaches $84k.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Get RSI signals delivered daily</h3>
            <p className="text-gray-400 text-sm mb-6">
              We calculate RSI + MACD + ATR for BTC, ETH, SOL, XRP, and DOGE every morning.
              Start your 7-day free trial.
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
                { href: '/guides/how-to-trade-polymarket-crypto', label: 'How to trade Polymarket crypto markets', desc: 'Full step-by-step trading guide' },
                { href: '/signals', label: 'Today\'s signals', desc: 'Live BTC/ETH/SOL/XRP/DOGE signals' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 hover:border-gray-700 transition-colors"
                >
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
