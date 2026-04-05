'use client';

import { useEffect, useState } from 'react';

interface ReferralData {
  code: string;
  link: string;
  referrals_count: number;
  pending_count: number;
}

export default function ReferralsPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/user/referral')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load referral data');
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleCopy() {
    if (!data) return;
    navigator.clipboard.writeText(data.link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleTweetShare() {
    if (!data) return;
    const tweet = encodeURIComponent(
      `I've been using Polymarket Signals to trade crypto smarter. Get started with my link: ${data.link}`,
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank', 'noopener,noreferrer');
  }

  const convertedCount = data
    ? data.referrals_count - data.pending_count
    : 0;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">Referral Program</h1>
      <p className="text-gray-500 mb-8">
        Refer a friend and get 1 month free when they subscribe.
      </p>

      {loading && (
        <p className="text-gray-400 animate-pulse">Loading your referral link…</p>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      {data && (
        <>
          {/* Referral link */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Your Referral Link
            </h2>
            <div className="flex items-center gap-3">
              <input
                readOnly
                value={data.link}
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono text-gray-800 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-center">
              <p className="text-3xl font-bold text-indigo-600">{data.referrals_count}</p>
              <p className="text-sm text-gray-500 mt-1">Friends Referred</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-center">
              <p className="text-3xl font-bold text-green-600">{convertedCount}</p>
              <p className="text-sm text-gray-500 mt-1">Converted (subscribed)</p>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleTweetShare}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X / Twitter
            </button>
          </div>

          {/* How it works */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              How It Works
            </h2>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs">1</span>
                <span>Share your unique referral link with friends.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs">2</span>
                <span>They sign up using your link.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs">3</span>
                <span>When they subscribe to any paid plan, you get <strong>1 month free</strong> added to your account.</span>
              </li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
