import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'How to Trade Polymarket Crypto Markets | Polymarket Signals Guide',
  description: 'Step-by-step guide to trading crypto prediction markets on Polymarket. Learn how to read LONG/SHORT signals, set position sizes, and use RSI, MACD, and ATR to find edge.',
  openGraph: {
    title: 'How to Trade Polymarket Crypto Markets',
    description: 'Complete guide to profitably trading crypto prediction markets on Polymarket using technical analysis signals.',
  },
};

export default function GuidePolymarketCryptoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/guides" className="hover:text-gray-400 transition-colors">Guides</Link>
          <span>›</span>
          <span className="text-gray-400">How to trade Polymarket crypto</span>
        </div>

        {/* Article header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-3 uppercase tracking-wider">
            Trading Guide · 8 min read
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            How to Trade Polymarket Crypto Prediction Markets
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Polymarket is one of the largest prediction market platforms in the world. Unlike a crypto exchange,
            you're not buying BTC — you're betting on where BTC will be at a specific time. This guide explains
            how to find edge on Polymarket's crypto markets using technical analysis.
          </p>
        </div>

        <div className="prose-style space-y-8 text-gray-300">

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">What is Polymarket?</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Polymarket is a prediction market built on Polygon. You deposit USDC and bet on the outcome of events.
              For crypto markets, the typical format is: <em>"Will BTC be above $90,000 on June 30, 2025?"</em>
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              If you believe yes, you buy YES shares. If you're right, each share pays out $1 USDC. If you're wrong,
              your shares are worth $0. Share prices trade between $0.01 and $0.99 and reflect the crowd's estimated
              probability.
            </p>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <div className="text-sm font-semibold text-white mb-2">Key insight</div>
              <p className="text-sm text-gray-400">
                If the market prices BTC above $90k at 60% probability, but your analysis says 75%, you have edge.
                Buy YES at $0.60 and expect to collect $1.00 on resolution. That's a 67% return on your capital
                if correct.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Why technical signals work on Polymarket</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Most Polymarket participants use intuition or news sentiment to set their positions. Very few apply
              quantitative technical analysis. This creates systematic mispricings — especially in the hours around
              market opens and closes when momentum is strongest.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              Technical indicators like RSI and MACD measure price momentum and mean-reversion probability.
              When RSI drops below 35 on a 15-minute chart, it statistically signals an oversold condition — meaning
              there's higher probability of a bounce within the next few hours. That bounce may be enough to push
              BTC above a nearby price threshold.
            </p>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'RSI < 35', desc: 'Price is statistically oversold. Bounce likely. Look for LONG (above threshold) markets.' },
                { label: 'RSI > 65', desc: 'Price is overbought. Pullback likely. Look for SHORT (below threshold) markets.' },
                { label: 'MACD bullish', desc: 'Short-term momentum is up. Confirms LONG signals. Adds confidence to the direction.' },
                { label: 'ATR high', desc: 'Volatility is elevated. Stop loss and take profit levels are wider. Adjust size accordingly.' },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3 rounded-lg border border-gray-800 bg-gray-900/30 p-3">
                  <span className="font-mono text-emerald-400 text-xs mt-0.5 shrink-0 font-bold">{item.label}</span>
                  <span className="text-gray-400">{item.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How to read a LONG/SHORT signal</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Each daily signal from Polymarket Signals gives you five data points:
            </p>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/60">
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Field</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Example</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { field: 'Direction', ex: 'LONG', meaning: 'Price likely to rise over the next 4–8 hours' },
                    { field: 'Confidence', ex: '72%', meaning: 'RSI, MACD, and BB all partially agree' },
                    { field: 'Entry', ex: '$83,200', meaning: 'Current price at signal generation' },
                    { field: 'Stop Loss', ex: '$81,950', meaning: 'Price where signal is invalidated (1× ATR below)' },
                    { field: 'Take Profit', ex: '$86,325', meaning: '2.5:1 risk-reward target (2× ATR above)' },
                  ].map((row) => (
                    <tr key={row.field} className="border-b border-gray-800/50 last:border-0">
                      <td className="px-4 py-3 font-medium text-gray-300">{row.field}</td>
                      <td className="px-4 py-3 font-mono text-emerald-400 text-xs">{row.ex}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{row.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 leading-relaxed">
              On Polymarket, a LONG signal means look for a market where you can bet YES on BTC being above its
              current price at expiry. A SHORT signal means look for a below-threshold market, or bet NO on an
              above-threshold one.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Position sizing on Polymarket</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              The stop loss in each signal tells you your invalidation point. Use this to calculate your position size:
            </p>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 mb-4">
              <div className="text-sm font-semibold text-emerald-300 mb-2">Position sizing formula</div>
              <p className="text-sm text-gray-300 font-mono">
                position_size = (account_risk) / (entry_price - stop_loss)
              </p>
              <p className="text-xs text-gray-500 mt-2">
                E.g., risk 2% of $1,000 ($20) on a signal where entry = $83,200 and stop = $81,950 (diff = $1,250)
                → buy 0.016 BTC worth of YES shares
              </p>
            </div>
            <p className="text-gray-400 leading-relaxed">
              On Polymarket specifically, treat each bet as binary. If you expect 75% chance of BTC above $85k
              and the market prices it at 55%, your edge is 20 percentage points. Size accordingly — don't bet
              your whole account on a single market.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Common mistakes when trading Polymarket</h2>
            <ul className="space-y-3">
              {[
                'Ignoring liquidity — small markets have wide spreads. Stick to BTC, ETH, SOL, XRP, DOGE.',
                'Chasing late signals — enter before the price moves, not after. Signals are generated at 8AM UTC.',
                'Over-sizing — on prediction markets, you can lose 100% of your position. Never risk more than 5% per trade.',
                'Ignoring expiry timing — a LONG signal is valid for 4–8 hours. Check your market\'s resolution time.',
                'Trading against strong trend — if RSI has been above 70 for 3 days, a SHORT signal may still be premature.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Setting up alerts for faster execution</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              The best time to act on a signal is within 30 minutes of generation (8AM–8:30AM UTC) before the
              initial move is priced in. Set up Telegram alerts in your dashboard settings to get notified
              the moment signals are published.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Pro subscribers can also receive signals via Slack and configure per-asset filters so you only
              get notified for assets you trade.
            </p>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Ready to apply signals to your Polymarket trades?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Start your 7-day free trial and access daily signals for BTC, ETH, SOL, XRP, and DOGE.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
              >
                Start Free Trial — No Card Required
              </Link>
              <Link
                href="/preview"
                className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:text-white text-sm transition-colors"
              >
                See a sample signal first →
              </Link>
            </div>
          </div>

          {/* Related */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Related guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/signals', label: 'View all signal assets', desc: 'BTC, ETH, SOL, XRP, DOGE coverage' },
                { href: '/compare', label: 'Compare vs alternatives', desc: 'Manual analysis vs Polymarket Signals' },
                { href: '/faq', label: 'FAQ', desc: 'Common questions about signals and billing' },
                { href: '/docs', label: 'API Documentation', desc: 'Integrate signals into your own system' },
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
