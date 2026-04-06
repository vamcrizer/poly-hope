import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// Shareable signal page — /signal?asset=BTC&dir=LONG&conf=0.78&entry=83200
// Used for Twitter/X sharing

interface PageProps {
  searchParams: Promise<{ asset?: string; dir?: string; conf?: string; entry?: string; sl?: string; tp?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const asset = params.asset ?? 'BTC';
  const direction = params.dir ?? 'LONG';
  const confidence = params.conf ?? '0.75';
  const entry = params.entry ?? '';

  const confidencePct = Math.round(parseFloat(confidence) * 100);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://polymarketsignals.com';

  const ogUrl = `${appUrl}/api/og?asset=${encodeURIComponent(asset)}&dir=${encodeURIComponent(direction)}&conf=${encodeURIComponent(confidence)}&entry=${encodeURIComponent(entry)}`;

  return {
    title: `${asset} ${direction} Signal — ${confidencePct}% Confidence | Polymarket Signals`,
    description: `AI-generated ${direction} signal for ${asset}${entry ? ` at $${entry}` : ''}. ${confidencePct}% confidence. Updated daily at 8AM UTC.`,
    openGraph: {
      title: `${asset} ${direction} Signal — ${confidencePct}% Confidence`,
      description: `AI-generated ${direction} signal for ${asset}${entry ? ` at $${entry}` : ''}. ${confidencePct}% confidence.`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${asset} ${direction} Signal — ${confidencePct}% Confidence`,
      description: `AI-generated ${direction} signal for ${asset}${entry ? ` at $${entry}` : ''}. ${confidencePct}% confidence.`,
      images: [ogUrl],
    },
  };
}

export default async function SignalSharePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const asset = params.asset ?? 'BTC';
  const direction = (params.dir ?? 'LONG') as 'LONG' | 'SHORT';
  const confidence = parseFloat(params.conf ?? '0.75');
  const entry = params.entry ? parseFloat(params.entry) : null;
  const sl = params.sl ? parseFloat(params.sl) : null;
  const tp = params.tp ? parseFloat(params.tp) : null;

  const isLong = direction === 'LONG';
  const confidencePct = Math.round(confidence * 100);

  function formatPrice(price: number | null): string {
    if (price === null) return '—';
    if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (price >= 1) return price.toFixed(4);
    return price.toFixed(6);
  }

  const assetColors: Record<string, string> = {
    BTC: 'text-orange-400', ETH: 'text-blue-400', SOL: 'text-purple-400',
    XRP: 'text-cyan-400', DOGE: 'text-yellow-400',
  };

  const assetColor = assetColors[asset] ?? 'text-gray-300';
  const dirColor = isLong ? 'text-emerald-400' : 'text-red-400';
  const dirBg = isLong ? 'bg-emerald-500/15 border-emerald-500/30' : 'bg-red-500/15 border-red-500/30';

  const tweetText = encodeURIComponent(
    `${asset} ${direction} signal — ${confidencePct}% confidence\n\nAI-powered Polymarket signal from @PolySignals\n\n`
  );
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 py-16">
        {/* Signal card */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden mb-6">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-bold ${assetColor}`}>{asset}</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-md border ${dirBg} ${dirColor}`}>
                {direction}
              </span>
            </div>
            <div className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">15m</div>
          </div>

          {/* Confidence */}
          <div className="px-5 pt-4 pb-3">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">AI Confidence</span>
              <span className={`text-base font-bold ${confidencePct >= 75 ? 'text-emerald-400' : confidencePct >= 65 ? 'text-yellow-400' : 'text-orange-400'}`}>
                {confidencePct}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${confidencePct >= 75 ? 'bg-emerald-500' : confidencePct >= 65 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                style={{ width: `${confidencePct}%` }}
              />
            </div>
          </div>

          {/* Price levels */}
          {(entry !== null || sl !== null || tp !== null) && (
            <div className="grid grid-cols-3 px-5 pb-4 pt-1 gap-2">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-0.5">Entry</p>
                <p className="text-sm font-semibold text-gray-100">${formatPrice(entry)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-red-500 uppercase mb-0.5">Stop Loss</p>
                <p className="text-sm font-semibold text-red-400">${formatPrice(sl)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-emerald-500 uppercase mb-0.5">Take Profit</p>
                <p className="text-sm font-semibold text-emerald-400">${formatPrice(tp)}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800 bg-gray-950/30">
            <span className="text-xs text-gray-600">Polymarket Signals</span>
            <span className="text-xs text-gray-600">Not financial advice</span>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex gap-3 mb-8">
          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(`https://polymarketsignals.com/signal?asset=${asset}&dir=${direction}&conf=${params.conf ?? '0.75'}${entry ? `&entry=${entry}` : ''}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1da1f2]/10 border border-[#1da1f2]/30 text-[#1da1f2] rounded-lg text-sm font-medium hover:bg-[#1da1f2]/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>
          <Link
            href="/signup"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition-colors"
          >
            Get All Signals →
          </Link>
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 text-center">
          <p className="text-sm text-gray-400 mb-3">
            Get daily signals for BTC, ETH, SOL, XRP, and DOGE with entry, stop-loss, and take-profit levels.
          </p>
          <Link href="/pricing" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
            View plans starting at $19/mo →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
