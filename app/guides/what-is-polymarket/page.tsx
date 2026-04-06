import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'What is Polymarket? Complete Guide to Prediction Markets | Polymarket Signals',
  description: 'Learn what Polymarket is, how crypto prediction markets work, how to deposit and trade, and how to find edge using technical signals on Polymarket.',
  openGraph: {
    title: 'What is Polymarket? Complete Guide to Prediction Markets',
    description: 'Everything you need to know about Polymarket — how it works, how to trade crypto markets, deposit USDC, and use signals to find edge.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What is Polymarket? Complete Guide to Prediction Markets',
  description: 'Everything you need to know about Polymarket — how it works, how to trade crypto markets, deposit USDC, and use signals to find edge.',
  author: { '@type': 'Organization', name: 'Polymarket Signals' },
  publisher: { '@type': 'Organization', name: 'Polymarket Signals', logo: { '@type': 'ImageObject', url: 'https://polymarketsignals.com/icon-192.png' } },
  datePublished: '2026-04-06',
  dateModified: '2026-04-06',
};

export default function WhatIsPolymarketPage() {
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
          <span className="text-gray-400">What is Polymarket</span>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-3 uppercase tracking-wider">
            Polymarket Basics · 7 min read
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            What is Polymarket? A Complete Guide
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Polymarket is a decentralized prediction market platform built on Polygon (a layer-2 Ethereum chain).
            Instead of trading assets directly, you bet on the outcome of real-world events — including where
            crypto prices will be at a specific date and time.
          </p>
        </div>

        <div className="space-y-8 text-gray-300">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How Polymarket works</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Polymarket markets are binary outcome questions. Every market has a "YES" share and a "NO" share.
              One side pays $1 USDC at resolution; the other pays $0. Prices fluctuate between $0.01 and $0.99,
              reflecting the crowd's estimated probability of the outcome.
            </p>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 mb-4">
              <div className="text-sm font-semibold text-white mb-3">Example market</div>
              <p className="text-sm text-gray-400">
                <strong className="text-gray-200">"Will BTC close above $90,000 on June 30, 2025?"</strong>
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-gray-500">
                <li>→ YES shares trade at $0.55 (55% implied probability)</li>
                <li>→ Buy YES for $0.55 → get $1.00 if BTC is above $90k at resolution</li>
                <li>→ Buy YES for $0.55 → get $0.00 if BTC is below $90k at resolution</li>
              </ul>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your profit comes from two sources: (1) correctly predicting the outcome, or (2) buying at a lower
              probability than the true probability and selling when the market reprices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How to get started on Polymarket</h2>
            <ol className="space-y-4">
              {[
                { step: 1, title: 'Connect a wallet', desc: 'Polymarket supports MetaMask, Coinbase Wallet, and other Polygon-compatible wallets. You\'ll need a wallet on the Polygon network.' },
                { step: 2, title: 'Deposit USDC', desc: 'Polymarket runs on USDC (USD Coin) on Polygon. Bridge USDC from Ethereum or buy MATIC/USDC directly on Polygon. Minimum deposit: $5.' },
                { step: 3, title: 'Find a market', desc: 'Browse markets by category. For crypto, filter by "Crypto" to find BTC, ETH, SOL, XRP, and DOGE markets with near-term expiry.' },
                { step: 4, title: 'Buy YES or NO shares', desc: 'If you believe the event will happen (BTC above $90k), buy YES. If not, buy NO. You can sell at any time before resolution.' },
                { step: 5, title: 'Collect at resolution', desc: 'Markets resolve automatically using data from price oracles. Winners receive $1 USDC per share; losers receive $0.' },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">{item.step}</span>
                  <div>
                    <div className="font-semibold text-white mb-1">{item.title}</div>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Types of crypto markets on Polymarket</h2>
            <div className="space-y-3">
              {[
                { type: 'Price threshold markets', example: '"Will BTC be above $85,000 on April 15?"', desc: 'The most common type. Simple above/below prediction for a specific date.' },
                { type: 'End-of-month markets', example: '"Will ETH be above $4,000 at end of May?"', desc: 'Monthly resolution. Good for position trades held over weeks.' },
                { type: 'Range markets', example: '"Will BTC trade between $80k–$90k this week?"', desc: 'Less common. Pays out if price stays within a range.' },
                { type: 'ATH markets', example: '"Will SOL hit a new all-time high in 2025?"', desc: 'Binary event — pays if asset hits a specific level before expiry.' },
              ].map((item) => (
                <div key={item.type} className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
                  <div className="font-semibold text-white text-sm mb-1">{item.type}</div>
                  <div className="font-mono text-xs text-emerald-400 mb-2">{item.example}</div>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How to find edge on Polymarket</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Edge on a prediction market means having a more accurate probability estimate than the crowd.
              If the market says 40% and you believe 60%, buying at $0.40 gives you positive expected value.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              For crypto markets specifically, two types of analysis help:
            </p>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Technical analysis', desc: 'RSI, MACD, and ATR identify momentum-driven price moves. An RSI of 22 (deeply oversold) suggests a bounce is likely — which could push BTC above a nearby threshold.' },
                { label: 'Market inefficiency', desc: 'Most Polymarket participants use gut feel or news. Very few use systematic technical analysis. This creates pricing gaps, especially on shorter-term markets.' },
                { label: 'Timing the market', desc: 'Signals generated at 8AM UTC capture overnight momentum. Acting within 30 minutes of signal generation often gets you in before the crowd reprices.' },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3 rounded-lg border border-gray-800 bg-gray-900/30 p-3">
                  <span className="text-emerald-400 shrink-0 mt-0.5">→</span>
                  <div>
                    <div className="font-medium text-gray-300 mb-0.5">{item.label}</div>
                    <div className="text-gray-500">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Polymarket vs crypto exchanges</h2>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/60">
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Feature</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Polymarket</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase font-medium">Exchange (e.g. Binance)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { f: 'What you\'re trading', pm: 'Probability (0–100%)', ex: 'Price (continuous)' },
                    { f: 'Max loss', pm: 'Your bet amount (100%)', ex: 'Unlimited (futures)' },
                    { f: 'Settlement', pm: 'Binary ($0 or $1)', ex: 'Exit price × position' },
                    { f: 'Leverage', pm: 'None (implied 1:1)', ex: 'Up to 125×' },
                    { f: 'KYC required', pm: 'No (wallet-based)', ex: 'Yes (most exchanges)' },
                    { f: 'Liquidity', pm: 'Lower (AMM)', ex: 'Higher (order book)' },
                  ].map((row) => (
                    <tr key={row.f} className="border-b border-gray-800/50 last:border-0">
                      <td className="px-4 py-3 text-gray-400 text-xs font-medium">{row.f}</td>
                      <td className="px-4 py-3 text-gray-300 text-xs">{row.pm}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{row.ex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Risks of trading on Polymarket</h2>
            <ul className="space-y-3">
              {[
                'Binary outcome: you can lose 100% of your bet. Size positions accordingly.',
                'Liquidity risk: small markets have wide bid-ask spreads. Stick to BTC, ETH, SOL, XRP, DOGE.',
                'Smart contract risk: Polymarket runs on Polygon. Bugs or exploits in the contract could affect funds.',
                'Resolution disputes: rarely, markets resolve controversially. Resolution data comes from oracles.',
                'Timing: if a market expires before your signal plays out, you could lose even if you were right directionally.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="text-yellow-400 shrink-0 mt-0.5">⚠</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Ready to trade Polymarket crypto markets?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Get daily LONG/SHORT signals for BTC, ETH, SOL, XRP, and DOGE — designed specifically for
              Polymarket prediction markets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup" className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors">
                Start Free Trial
              </Link>
              <Link href="/guides/how-to-trade-polymarket-crypto" className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:text-white text-sm transition-colors">
                Read the full trading guide →
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Learn more</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/guides/how-to-trade-polymarket-crypto', label: 'How to trade Polymarket crypto', desc: 'Full strategy guide with position sizing' },
                { href: '/guides/what-is-rsi-crypto', label: 'What is RSI?', desc: 'The main signal indicator explained' },
                { href: '/signals', label: 'Today\'s signals', desc: 'Live BTC/ETH/SOL/XRP/DOGE signals' },
                { href: '/faq', label: 'FAQ', desc: 'Common questions about Polymarket Signals' },
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
