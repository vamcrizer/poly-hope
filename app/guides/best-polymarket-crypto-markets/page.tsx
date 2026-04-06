import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Best Crypto Markets to Trade on Polymarket | Polymarket Signals Guide',
  description: 'Which crypto prediction markets on Polymarket are worth trading? Compare BTC, ETH, SOL, XRP, and DOGE markets by liquidity, spread, and signal accuracy.',
  openGraph: {
    title: 'Best Crypto Markets to Trade on Polymarket',
    description: 'BTC vs ETH vs SOL vs XRP vs DOGE on Polymarket — liquidity, spreads, signal hit rate, and which assets produce the highest-confidence signals.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Crypto Markets to Trade on Polymarket',
  description: 'Which crypto prediction markets on Polymarket are worth trading? Compare BTC, ETH, SOL, XRP, and DOGE markets by liquidity, spread, and signal accuracy.',
  author: { '@type': 'Organization', name: 'Polymarket Signals' },
  publisher: { '@type': 'Organization', name: 'Polymarket Signals', logo: { '@type': 'ImageObject', url: 'https://polymarketsignals.com/icon-192.png' } },
  datePublished: '2026-04-06',
  dateModified: '2026-04-06',
};

export default function BestMarketsGuidePage() {
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
          <span className="text-gray-400">Best crypto markets on Polymarket</span>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-3 uppercase tracking-wider">
            Polymarket Basics · 6 min read
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Best Crypto Markets to Trade on Polymarket
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Not all Polymarket prediction markets are equal. Liquidity, spread width, and how predictable
            the asset is technically all vary by coin. This guide ranks the five major crypto markets
            available on Polymarket and explains why BTC tends to produce the most reliable signals.
          </p>
        </div>

        <div className="space-y-8 text-gray-300">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Why market selection matters on Polymarket</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              On a spot exchange, you can exit any time. On Polymarket, you're trading a binary outcome —
              so if you enter a market that's thinly traded, you may face wide bid-ask spreads or struggle
              to exit before resolution. The best Polymarket markets are:
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                'High liquidity — large pools with tight pricing',
                'Technically predictable — the asset responds well to RSI/MACD signals',
                'Active volume — many traders updating prices means faster repricing after signal',
                'Short to medium duration — gives signals time to play out before expiry',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 shrink-0">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Asset breakdown: BTC, ETH, SOL, XRP, DOGE</h2>
            <div className="space-y-4">
              {[
                {
                  ticker: 'BTC',
                  name: 'Bitcoin',
                  color: 'text-orange-400',
                  border: 'border-orange-500/20',
                  bg: 'bg-orange-500/5',
                  liquidity: 'Highest',
                  signalQuality: 'Best',
                  spread: 'Tightest',
                  summary: 'BTC is the deepest market on Polymarket by volume and pool size. Technical signals work especially well because BTC price action is heavily influenced by institutional participants who trade algorithmically — meaning RSI extremes genuinely predict mean-reversion. Start here.',
                  rating: 5,
                },
                {
                  ticker: 'ETH',
                  name: 'Ethereum',
                  color: 'text-blue-400',
                  border: 'border-blue-500/20',
                  bg: 'bg-blue-500/5',
                  liquidity: 'High',
                  signalQuality: 'Very Good',
                  spread: 'Tight',
                  summary: 'ETH is the second most liquid market. It often follows BTC directionally but with slightly higher volatility — ATR values are proportionally larger. MACD signals tend to be cleaner on ETH due to strong trend momentum phases.',
                  rating: 4,
                },
                {
                  ticker: 'SOL',
                  name: 'Solana',
                  color: 'text-purple-400',
                  border: 'border-purple-500/20',
                  bg: 'bg-purple-500/5',
                  liquidity: 'Good',
                  signalQuality: 'Good',
                  spread: 'Medium',
                  summary: 'SOL has good liquidity but is more volatile than BTC/ETH. RSI signals fire more frequently due to larger intraday swings. This can mean more trading opportunities — but also more false breakouts. Best used with high-confidence signals (75%+).',
                  rating: 3,
                },
                {
                  ticker: 'XRP',
                  name: 'XRP',
                  color: 'text-cyan-400',
                  border: 'border-cyan-500/20',
                  bg: 'bg-cyan-500/5',
                  liquidity: 'Moderate',
                  signalQuality: 'Good',
                  spread: 'Medium',
                  summary: 'XRP can be news-driven around legal/regulatory events, which introduces non-technical price moves. Technical signals work well in calm periods but can fail when XRP reacts to SEC/regulatory news. Check for major upcoming events before trading XRP signals.',
                  rating: 3,
                },
                {
                  ticker: 'DOGE',
                  name: 'Dogecoin',
                  color: 'text-yellow-400',
                  border: 'border-yellow-500/20',
                  bg: 'bg-yellow-500/5',
                  liquidity: 'Moderate',
                  signalQuality: 'Lower',
                  spread: 'Wider',
                  summary: 'DOGE is the highest-risk market. It\'s driven heavily by social media sentiment (Twitter/X, Elon Musk tweets) rather than technicals. RSI and MACD work less reliably here. Only trade DOGE signals when confidence is 78%+ and avoid during high-volatility news cycles.',
                  rating: 2,
                },
              ].map((asset) => (
                <div key={asset.ticker} className={`rounded-xl border ${asset.border} ${asset.bg} p-5`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-xl font-bold font-mono ${asset.color}`}>{asset.ticker}</span>
                      <span className="text-gray-400 text-sm">{asset.name}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${i < asset.rating ? 'bg-emerald-400' : 'bg-gray-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <div>
                      <div className="text-gray-600 mb-0.5">Liquidity</div>
                      <div className="text-gray-300 font-medium">{asset.liquidity}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-0.5">Signal Quality</div>
                      <div className="text-gray-300 font-medium">{asset.signalQuality}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-0.5">Spread</div>
                      <div className="text-gray-300 font-medium">{asset.spread}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{asset.summary}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How to choose your markets</h2>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/60">
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Your situation</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Recommended markets</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { situation: 'New to Polymarket', rec: 'BTC only — highest liquidity, tightest spreads' },
                    { situation: 'Intermediate, want more trades', rec: 'BTC + ETH — both are reliable' },
                    { situation: 'Experienced, higher risk tolerance', rec: 'BTC + ETH + SOL — more signals, higher volatility' },
                    { situation: 'Advanced, all markets', rec: 'All 5 — filter by confidence ≥ 75%' },
                    { situation: 'News event day (Fed/CPI/etc)', rec: 'Skip SOL/XRP/DOGE — stick to BTC/ETH' },
                  ].map((row) => (
                    <tr key={row.situation} className="border-b border-gray-800/50 last:border-0">
                      <td className="px-4 py-3 text-gray-400 text-xs">{row.situation}</td>
                      <td className="px-4 py-3 text-gray-300 text-xs">{row.rec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Understanding market duration on Polymarket</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Polymarket crypto markets come in different duration windows. Matching your signal timeframe to the
              market expiry is critical:
            </p>
            <div className="space-y-3">
              {[
                {
                  duration: 'Daily markets (expire tonight)',
                  use: 'Same-day RSI signals generated at 8AM. If BTC RSI is 22, a daily above-threshold market fits perfectly.',
                  risk: 'If signal doesn\'t play out in 12h, you lose even if directionally right.',
                },
                {
                  duration: 'Weekly markets (expire end of week)',
                  use: 'Stronger conviction trades. RSI + MACD aligned with 75%+ confidence gives the signal 5 days to resolve.',
                  risk: 'Higher variance — 5 days of price action means more potential for drawdown before resolution.',
                },
                {
                  duration: 'Monthly markets (expire end of month)',
                  use: 'Best for macro-view signals. Only use when you have strong conviction that the trend will continue.',
                  risk: 'Capital is locked for weeks. High opportunity cost.',
                },
              ].map((item) => (
                <div key={item.duration} className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
                  <div className="font-semibold text-white text-sm mb-2">{item.duration}</div>
                  <p className="text-xs text-emerald-400/80 mb-1">
                    <strong className="text-emerald-400">Use for:</strong> {item.use}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong className="text-gray-400">Risk:</strong> {item.risk}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Practical tips for finding the best markets</h2>
            <ul className="space-y-3">
              {[
                'Check pool size before entering. A market with $500 total liquidity will have a poor bid-ask. Look for markets with $5,000+ in the pool.',
                'Find a threshold near the current price. A BTC LONG signal is most valuable when there\'s an active "Will BTC be above $X?" market near the current price.',
                'Match your signal direction to the market type. LONG signals → buy YES on above-threshold markets. SHORT signals → buy NO on above-threshold markets.',
                'Avoid markets expiring within 2 hours of a major economic event (CPI, Fed rate decision, FOMC). Signal reliability drops dramatically.',
                'For DOGE and XRP, check Twitter/X before entry. Sudden narrative shifts can invalidate any technical signal within minutes.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="text-emerald-400 shrink-0 mt-0.5 font-bold">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Get signals for all 5 assets</h3>
            <p className="text-gray-400 text-sm mb-6">
              Daily LONG/SHORT signals for BTC, ETH, SOL, XRP, and DOGE — with confidence scores to help
              you filter which markets are worth trading today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup" className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors">
                Start Free Trial
              </Link>
              <Link href="/preview" className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:text-white text-sm transition-colors">
                Preview today's signals →
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">More guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/guides/what-is-polymarket', label: 'What is Polymarket?', desc: 'How prediction markets work' },
                { href: '/guides/how-to-trade-polymarket-crypto', label: 'How to trade Polymarket', desc: 'Full strategy guide' },
                { href: '/guides/what-is-rsi-crypto', label: 'What is RSI?', desc: 'The primary signal indicator' },
                { href: '/faq', label: 'FAQ', desc: 'Common questions answered' },
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
