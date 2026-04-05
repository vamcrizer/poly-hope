'use client';

import { useEffect, useState } from 'react';

const AVAILABLE_EVENTS = [
  { value: 'signal.generated', label: 'Signal Generated', desc: 'Fired when new signals are computed' },
  { value: 'signal.expired', label: 'Signal Expired', desc: 'Fired when a signal passes its validity window' },
];

interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  created_at: string;
}

interface TestResult {
  webhookId: string;
  success: boolean;
  status_code?: number;
  response_time_ms?: number;
}

type SubscriptionInfo = {
  plan: string;
  status: string;
} | null;

export default function WebhooksPage() {
  const [sub, setSub] = useState<SubscriptionInfo>(null);
  const [subLoading, setSubLoading] = useState(true);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [listLoading, setListLoading] = useState(true);

  // Form state
  const [newUrl, setNewUrl] = useState('');
  const [newEvents, setNewEvents] = useState<string[]>(['signal.generated']);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);

  // Test state
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [testingId, setTestingId] = useState<string | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user/subscription')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setSub(data ?? null))
      .catch(() => setSub(null))
      .finally(() => setSubLoading(false));
  }, []);

  useEffect(() => {
    if (sub && sub.status === 'active' && ['pro', 'api'].includes(sub.plan)) {
      loadWebhooks();
    } else {
      setListLoading(false);
    }
  }, [sub]);

  async function loadWebhooks() {
    setListLoading(true);
    try {
      const res = await fetch('/api/webhooks/register');
      const data = await res.json();
      if (res.ok) setWebhooks(data.webhooks ?? []);
    } catch {
      // silent
    } finally {
      setListLoading(false);
    }
  }

  async function handleAddWebhook(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    setNewSecret(null);

    try {
      const res = await fetch('/api/webhooks/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl.trim(), events: newEvents }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error ?? 'Failed to register webhook');
        return;
      }
      setNewSecret(data.secret);
      setNewUrl('');
      setNewEvents(['signal.generated']);
      await loadWebhooks();
    } catch {
      setAddError('Network error. Please try again.');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch('/api/webhooks/register', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setWebhooks((prev) => prev.filter((w) => w.id !== id));
      }
    } catch {
      // silent
    } finally {
      setDeletingId(null);
    }
  }

  async function handleTest(webhookId: string) {
    setTestingId(webhookId);
    setTestResults((prev) => {
      const next = { ...prev };
      delete next[webhookId];
      return next;
    });
    try {
      const res = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhook_id: webhookId }),
      });
      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [webhookId]: { webhookId, ...data },
      }));
    } catch {
      setTestResults((prev) => ({
        ...prev,
        [webhookId]: { webhookId, success: false },
      }));
    } finally {
      setTestingId(null);
    }
  }

  function copySecret() {
    if (!newSecret) return;
    navigator.clipboard.writeText(newSecret).then(() => {
      setSecretCopied(true);
      setTimeout(() => setSecretCopied(false), 2000);
    });
  }

  function toggleEvent(event: string) {
    setNewEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  }

  if (subLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isPro =
    sub?.status === 'active' && ['pro', 'api'].includes(sub.plan ?? '');

  if (!isPro) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">Webhooks require Pro or API plan</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Webhook delivery lets you receive real-time signal notifications to your own server.
          Upgrade to Pro or API tier to get started.
        </p>
        <a
          href="/pricing"
          className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-xl transition-colors"
        >
          Upgrade now
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Webhooks</h1>
        <p className="text-gray-400 text-sm mt-1">
          Receive real-time signal events via HTTP POST to your server.
        </p>
      </div>

      {/* Add Webhook Form */}
      <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 space-y-5">
        <h2 className="text-base font-semibold text-white">Register webhook endpoint</h2>

        <form onSubmit={handleAddWebhook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Endpoint URL
            </label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://yourapp.com/webhooks/signals"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Must be a valid HTTPS URL.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Events</label>
            <div className="space-y-2">
              {AVAILABLE_EVENTS.map((ev) => (
                <label key={ev.value} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={newEvents.includes(ev.value)}
                    onChange={() => toggleEvent(ev.value)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-200">{ev.label}</p>
                    <p className="text-xs text-gray-500">{ev.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {addError && (
            <p className="text-sm text-red-400">{addError}</p>
          )}

          <button
            type="submit"
            disabled={adding || newEvents.length === 0 || !newUrl.trim()}
            className="rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold px-4 py-2 text-sm transition-colors"
          >
            {adding ? 'Registering…' : 'Register webhook'}
          </button>
        </form>

        {/* Secret reveal — shown once after creation */}
        {newSecret && (
          <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-emerald-400">Save your webhook secret now</p>
            </div>
            <p className="text-xs text-gray-400">
              This secret is shown only once. Use it to verify the{' '}
              <code className="text-emerald-300">X-Polymarket-Signature</code> header on incoming requests.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-xs text-emerald-300 font-mono break-all">
                {newSecret}
              </code>
              <button
                onClick={copySecret}
                className="shrink-0 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 text-xs text-gray-300 transition-colors"
              >
                {secretCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* HMAC verification instructions */}
      <section className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 space-y-3">
        <h2 className="text-base font-semibold text-white">Verifying signatures</h2>
        <p className="text-sm text-gray-400">
          Every request includes an{' '}
          <code className="text-emerald-300 bg-gray-800 px-1 rounded">X-Polymarket-Signature</code>{' '}
          header. Verify it with HMAC-SHA256:
        </p>
        <pre className="text-xs bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto text-emerald-300 font-mono whitespace-pre">
{`// Node.js example
import { createHmac } from 'crypto';

function verify(secret, rawBody, header) {
  const expected = 'sha256=' +
    createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');
  return expected === header;
}`}
        </pre>
      </section>

      {/* Registered webhooks list */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">Registered webhooks</h2>

        {listLoading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
            <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
            Loading…
          </div>
        )}

        {!listLoading && webhooks.length === 0 && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6 text-center">
            <p className="text-gray-500 text-sm">No webhooks registered yet.</p>
          </div>
        )}

        {!listLoading && webhooks.length > 0 && (
          <div className="space-y-3">
            {webhooks.map((w) => {
              const testResult = testResults[w.id];
              return (
                <div
                  key={w.id}
                  className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                            w.status === 'active' ? 'bg-emerald-400' : 'bg-gray-600'
                          }`}
                        />
                        <p className="text-sm font-mono text-white truncate">{w.url}</p>
                      </div>
                      <div className="flex flex-wrap gap-1 pl-4">
                        {w.events.map((ev) => (
                          <span
                            key={ev}
                            className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700"
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleTest(w.id)}
                        disabled={testingId === w.id}
                        className="rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-medium px-3 py-1.5 transition-colors disabled:opacity-50"
                      >
                        {testingId === w.id ? 'Testing…' : 'Test'}
                      </button>
                      <button
                        onClick={() => handleDelete(w.id)}
                        disabled={deletingId === w.id}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium px-3 py-1.5 transition-colors disabled:opacity-50"
                      >
                        {deletingId === w.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>

                  {testResult && (
                    <div
                      className={`text-xs px-3 py-2 rounded-lg ${
                        testResult.success
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {testResult.success ? (
                        <>
                          Test delivered successfully
                          {testResult.status_code && ` — HTTP ${testResult.status_code}`}
                          {testResult.response_time_ms !== undefined &&
                            ` — ${testResult.response_time_ms}ms`}
                        </>
                      ) : (
                        <>
                          Delivery failed
                          {testResult.status_code && ` — HTTP ${testResult.status_code}`}
                          {testResult.response_time_ms !== undefined &&
                            ` — ${testResult.response_time_ms}ms`}
                        </>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-600 pl-4">
                    Registered {new Date(w.created_at).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
