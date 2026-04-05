'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserData {
  email: string;
  plan: string;
  status: string;
}

interface ApiKeyData {
  key: string; // masked, e.g. sk_pm_xxxx...xxxx
}

function maskKey(key: string): string {
  if (!key || key.length < 12) return key;
  const prefix = key.slice(0, 12);
  const suffix = key.slice(-4);
  return `${prefix}...${suffix}`;
}

export default function ApiKeyPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [keyLoading, setKeyLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch user profile
  useEffect(() => {
    fetch('/api/user/me')
      .then((r) => {
        if (r.status === 401) {
          router.push('/login');
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  // Fetch API key (only if plan is 'api')
  const fetchApiKey = useCallback(() => {
    setKeyLoading(true);
    setError(null);
    fetch('/api/user/api-key')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load API key');
        return r.json();
      })
      .then((data: ApiKeyData) => {
        setApiKey(data.key ?? '');
        setKeyLoading(false);
      })
      .catch(() => {
        setError('Failed to load your API key. Please refresh the page.');
        setKeyLoading(false);
      });
  }, []);

  useEffect(() => {
    if (user && user.plan === 'api') {
      fetchApiKey();
    }
  }, [user, fetchApiKey]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy to clipboard. Please copy the key manually.');
    }
  };

  const handleRegenerate = async () => {
    setShowConfirm(false);
    setRegenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/user/api-key', { method: 'POST' });
      if (!res.ok) throw new Error('Regeneration failed');
      const data: ApiKeyData = await res.json();
      setApiKey(data.key ?? '');
    } catch {
      setError('Failed to regenerate API key. Please try again.');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold text-emerald-400">
              &#9889;
            </Link>
            <span className="font-semibold text-white">Polymarket Signals</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">
              API Key
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              &#8592; Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-white">API Key</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your API key for programmatic access to signals.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Not on API plan — upgrade CTA */}
        {user && user.plan !== 'api' && (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-7 text-center">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-7 h-7 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">API Access Required</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              API access is available on the API plan ($99/mo). Upgrade to get a REST API key
              with 1,000 requests/day, all 5 asset signals, and webhook delivery.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl border border-emerald-500 shadow-lg shadow-emerald-500/20 transition-all duration-150"
            >
              Upgrade to API Plan
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}

        {/* API Key management — shown only for api plan */}
        {user && user.plan === 'api' && (
          <>
            {/* Key card */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your API Key</p>
                  {keyLoading ? (
                    <div className="h-8 w-64 rounded-md bg-gray-800 animate-pulse" />
                  ) : (
                    <code className="text-base font-mono text-gray-100 tracking-wider">
                      {maskKey(apiKey)}
                    </code>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Copy button */}
                  <button
                    onClick={handleCopy}
                    disabled={keyLoading || !apiKey}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 border ${
                      copied
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700 hover:border-gray-600 disabled:opacity-40'
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>

                  {/* Regenerate button */}
                  <button
                    onClick={() => setShowConfirm(true)}
                    disabled={keyLoading || regenerating}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:border-gray-600 transition-all duration-150 disabled:opacity-40"
                  >
                    {regenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Regenerate
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-600">
                Key is partially masked for security. The full key is only shown once upon generation.
                Keep it secret — treat it like a password.
              </p>
            </div>

            {/* Confirm dialog */}
            {showConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-sm rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-2">Regenerate API Key?</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Your current API key will be invalidated immediately. Any systems using it
                    will stop working until updated with the new key.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRegenerate}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 border border-red-500 transition-colors"
                    >
                      Yes, Regenerate
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Rate limits */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <p className="text-sm font-semibold text-gray-300 mb-3">Rate Limits</p>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Daily limit</p>
                  <p className="font-semibold text-white">1,000 requests</p>
                </div>
                <div className="w-px h-8 bg-gray-800" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Resets</p>
                  <p className="font-semibold text-white">Midnight UTC</p>
                </div>
                <div className="w-px h-8 bg-gray-800" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Rate limit header</p>
                  <code className="text-xs font-mono text-yellow-400">X-RateLimit-Remaining</code>
                </div>
              </div>
            </div>

            {/* Usage instructions */}
            <div className="rounded-xl border border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 bg-gray-900/60 border-b border-gray-800">
                <p className="text-sm font-semibold text-gray-300">Quick Start</p>
                <Link
                  href="/docs"
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  View Full API Docs &#8594;
                </Link>
              </div>
              <pre className="p-5 text-sm font-mono text-gray-300 overflow-x-auto bg-gray-950 leading-relaxed">
                {`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://polymarketsignals.com/api/v1/signals`}
              </pre>
            </div>

            {/* Docs link */}
            <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/30 p-5">
              <div>
                <p className="text-sm font-semibold text-white">API Documentation</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Full endpoint reference, response schemas, code examples
                </p>
              </div>
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-150"
              >
                View API Docs
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
