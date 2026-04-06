'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatConfidence, formatPrice, getDirectionBg, calcRiskReward, timeAgo } from '@/lib/utils';
import { OnboardingChecklist } from '@/components/OnboardingChecklist';
import { MarketBiasBadge } from '@/components/MarketBiasBadge';
import { NextSignalCountdown } from '@/components/NextSignalCountdown';
import type { Signal } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const [copiedAsset, setCopiedAsset] = useState<string | null>(null);
  const [hasTelegram, setHasTelegram] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [checklistDismissed, setChecklistDismissed] = useState(false);

  function buildShareUrl(signal: Signal): string {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://polymarketsignals.com';
    const params = new URLSearchParams({
      asset: signal.asset,
      dir: signal.direction,
      conf: String(signal.confidence),
      ...(signal.entry_price ? { entry: String(signal.entry_price) } : {}),
      ...(signal.stop_loss ? { sl: String(signal.stop_loss) } : {}),
      ...(signal.take_profit ? { tp: String(signal.take_profit) } : {}),
    });
    return `${base}/signal?${params.toString()}`;
  }

  async function handleShare(signal: Signal) {
    const url = buildShareUrl(signal);
    await navigator.clipboard.writeText(url);
    setCopiedAsset(signal.asset);
    setTimeout(() => setCopiedAsset(null), 2000);
  }

  useEffect(() => {
    fetch('/api/user/me')
      .then((r) => {
        if (r.status === 401) { router.push('/login'); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        // auth redirect only — layout handles user display
      })
      .catch(() => router.push('/login'));

    // Load checklist data in parallel
    fetch('/api/user/telegram')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.telegram_chat_id) setHasTelegram(true); })
      .catch(() => {});
    fetch('/api/user/api-key')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.key) setHasApiKey(true); })
      .catch(() => {});

    const dismissed = sessionStorage.getItem('checklist_dismissed');
    if (dismissed) setChecklistDismissed(true);
  }, [router]);

  useEffect(() => {
    fetch('/api/signals')
      .then((r) => r.json())
      .then((data) => {
        if (data.error === 'subscription_required') {
          setNeedsUpgrade(true);
          setLoading(false);
          return;
        }
        setSignals(data.signals ?? []);
        setGeneratedAt(data.generated_at ?? '');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load signals. Please try again.');
        setLoading(false);
      });
  }, []);

  function handleChecklistDismiss() {
    setChecklistDismissed(true);
    sessionStorage.setItem('checklist_dismissed', '1');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Onboarding checklist */}
      {!loading && !needsUpgrade && !checklistDismissed && (
        <OnboardingChecklist
          hasTelegram={hasTelegram}
          hasApiKey={hasApiKey}
          hasViewedSignals={signals.length > 0}
          onDismiss={handleChecklistDismiss}
        />
      )}

      {/* Upgrade banner */}
      {needsUpgrade && (
        <div className="mb-8 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-yellow-400 mb-1">Subscription Required</h3>
              <p className="text-sm text-gray-400">
                Start a subscription to access daily signals for BTC, ETH, SOL, XRP, and DOGE.
              </p>
            </div>
            <a
              href="/pricing"
              className="ml-4 shrink-0 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
            >
              View Plans →
            </a>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Today&apos;s Signals</h1>
          {generatedAt && (
            <p className="text-sm text-gray-500 mt-1">
              Updated {timeAgo(generatedAt)} · {new Date(generatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC
            </p>
          )}
          {!loading && !generatedAt && <NextSignalCountdown />}
          {signals.length > 0 && (
            <div className="mt-2">
              <MarketBiasBadge signals={signals} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <a href="/api/signals/export" className="hidden sm:block text-sm text-gray-500 hover:text-gray-300 transition-colors">
            Export CSV
          </a>
          <a
            href="/backtest"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View Backtest →
          </a>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !needsUpgrade && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-800/50 animate-pulse" />
          ))}
        </div>
      )}

      {/* Desktop table */}
      {!loading && !needsUpgrade && signals.length > 0 && (
        <>
          <div className="hidden md:block rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/80 text-left">
                  <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Direction</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Entry</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Stop Loss</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Take Profit</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">R:R</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">TF</th>
                  <th className="px-3 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {signals.map((signal) => (
                  <tr key={signal.asset} className="bg-gray-900/40 hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-white">
                          {signal.asset[0]}
                        </div>
                        <span className="font-semibold text-white">{signal.asset}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${getDirectionBg(signal.direction)}`}>
                        {signal.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-gray-700">
                          <div
                            className="h-1.5 rounded-full bg-emerald-500"
                            style={{ width: `${signal.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-white">{formatConfidence(signal.confidence)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-white">{formatPrice(signal.entry_price)}</td>
                    <td className="px-6 py-4 text-sm font-mono text-red-400">{formatPrice(signal.stop_loss)}</td>
                    <td className="px-6 py-4 text-sm font-mono text-emerald-400">{formatPrice(signal.take_profit)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-300">{calcRiskReward(signal)}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 font-mono">
                        {signal.timeframe}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <button
                        onClick={() => handleShare(signal)}
                        title="Copy shareable link"
                        className="p-1.5 rounded text-gray-500 hover:text-emerald-400 hover:bg-gray-800 transition-all"
                      >
                        {copiedAsset === signal.asset ? (
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {signals.map((signal) => (
              <div key={signal.asset} className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold">
                      {signal.asset[0]}
                    </div>
                    <span className="font-bold text-white">{signal.asset}</span>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${getDirectionBg(signal.direction)}`}>
                    {signal.direction}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Confidence</p>
                    <p className="font-medium text-white">{formatConfidence(signal.confidence)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">R:R Ratio</p>
                    <p className="font-medium text-gray-300">{calcRiskReward(signal)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Entry</p>
                    <p className="font-mono text-white">{formatPrice(signal.entry_price)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Timeframe</p>
                    <p className="font-mono text-gray-300">{signal.timeframe}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Stop Loss</p>
                    <p className="font-mono text-red-400">{formatPrice(signal.stop_loss)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Take Profit</p>
                    <p className="font-mono text-emerald-400">{formatPrice(signal.take_profit)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && !needsUpgrade && signals.length === 0 && !error && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No signals yet</h3>
          <p className="text-gray-500 text-sm">Signals are generated daily at 8AM UTC.</p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-8 text-xs text-gray-600 text-center">
        Signals are for informational purposes only. Not financial advice. Past performance does not guarantee future results.
        Always do your own research before trading on Polymarket.
      </p>
    </div>
  );
}
