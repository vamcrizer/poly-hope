'use client';

import { useEffect, useState } from 'react';

interface TelegramStatus {
  telegram_chat_id: string | null;
}

export default function SettingsPage() {
  const [chatId, setChatId] = useState('');
  const [savedChatId, setSavedChatId] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [savingEmail, setSavingEmail] = useState(false);
  const [minConfidence, setMinConfidence] = useState(0);
  const [alertAssets, setAlertAssets] = useState<string[]>(['BTC', 'ETH', 'SOL', 'XRP', 'DOGE']);
  const [slackUrl, setSlackUrl] = useState('');
  const [savedSlackUrl, setSavedSlackUrl] = useState<string | null>(null);
  const [savingSlack, setSavingSlack] = useState(false);
  const [slackError, setSlackError] = useState<string | null>(null);
  const [slackSuccess, setSlackSuccess] = useState(false);
  const [testingSlack, setTestingSlack] = useState(false);
  const [slackTestResult, setSlackTestResult] = useState<boolean | null>(null);
  const [canUseSlack, setCanUseSlack] = useState(false);

  useEffect(() => {
    const loadTelegram = fetch('/api/user/telegram')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load settings');
        return res.json() as Promise<TelegramStatus>;
      })
      .then((data) => {
        setSavedChatId(data.telegram_chat_id);
        if (data.telegram_chat_id) setChatId(data.telegram_chat_id);
      })
      .catch(console.error);

    const loadNotifs = fetch('/api/user/notifications')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data) { setEmailAlertsEnabled(data.email_alerts_enabled); if (typeof data.min_confidence === 'number') setMinConfidence(data.min_confidence); if (data.alert_assets) setAlertAssets(data.alert_assets.split(',').map((a: string) => a.trim())); } })
      .catch(console.error);

    const loadSlack = fetch('/api/user/slack')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data?.slack_webhook_url) { setSavedSlackUrl(data.slack_webhook_url); setSlackUrl(data.slack_webhook_url); } })
      .catch(console.error);

    const loadSub = fetch('/api/user/subscription')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data && ['pro', 'api'].includes(data.plan) && data.status === 'active') setCanUseSlack(true); })
      .catch(console.error);

    Promise.allSettled([loadTelegram, loadNotifs, loadSlack, loadSub]).finally(() => setLoadingStatus(false));
  }, []);

  async function handleEmailToggle(enabled: boolean) {
    setEmailAlertsEnabled(enabled);
    setSavingEmail(true);
    try {
      await fetch('/api/user/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_alerts_enabled: enabled }),
      });
    } catch {
      setEmailAlertsEnabled(!enabled);
    } finally {
      setSavingEmail(false);
    }
  }

  async function handleMinConfidenceChange(val: number) {
    setMinConfidence(val);
    await fetch('/api/user/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ min_confidence: val }),
    }).catch(() => {});
  }

  async function handleAssetToggle(asset: string) {
    const next = alertAssets.includes(asset)
      ? alertAssets.filter((a) => a !== asset)
      : [...alertAssets, asset];
    if (next.length === 0) return; // always keep at least one
    setAlertAssets(next);
    await fetch('/api/user/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alert_assets: next.join(',') }),
    }).catch(() => {});
  }

  async function handleSaveSlack(e: React.FormEvent) {
    e.preventDefault();
    setSavingSlack(true);
    setSlackError(null);
    setSlackSuccess(false);
    try {
      const res = await fetch('/api/user/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slack_webhook_url: slackUrl }),
      });
      const data = await res.json();
      if (!res.ok) { setSlackError(data.error || 'Failed to save'); }
      else { setSavedSlackUrl(slackUrl); setSlackSuccess(true); setTimeout(() => setSlackSuccess(false), 3000); }
    } catch { setSlackError('Network error'); }
    finally { setSavingSlack(false); }
  }

  async function handleTestSlack() {
    setTestingSlack(true);
    setSlackTestResult(null);
    try {
      const res = await fetch('/api/user/slack', { method: 'PUT' });
      const data = await res.json();
      setSlackTestResult(data.success === true);
    } catch { setSlackTestResult(false); }
    finally { setTestingSlack(false); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    setTestResult(null);

    try {
      const res = await fetch('/api/user/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId.trim() }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setSaveError(json.error ?? 'Failed to save');
      } else {
        setSavedChatId(chatId.trim());
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/user/telegram/test', { method: 'POST' });
      const json = await res.json();
      if (res.ok && json.success) {
        setTestResult({ ok: true, message: 'Test message sent! Check your Telegram.' });
      } else {
        setTestResult({ ok: false, message: json.error ?? 'Failed to send test message.' });
      }
    } catch {
      setTestResult({ ok: false, message: 'Network error. Please try again.' });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Telegram Alerts */}
      <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-white">Telegram Alerts</h2>
          {!loadingStatus && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                savedChatId
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {savedChatId ? 'Enabled' : 'Not configured'}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Receive trade signals directly in Telegram.
        </p>

        <ol className="text-sm text-gray-300 space-y-1 mb-5 list-decimal list-inside">
          <li>
            Start{' '}
            <a
              href="https://t.me/PolySignalsBot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline font-medium"
            >
              @PolySignalsBot
            </a>{' '}
            on Telegram.
          </li>
          <li>Send <code className="bg-gray-800 rounded px-1">/start</code> to the bot.</li>
          <li>The bot will reply with your chat ID. Copy it.</li>
          <li>Paste your chat ID below and save.</li>
        </ol>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="chat-id" className="block text-sm font-medium text-gray-300 mb-1">
              Telegram Chat ID
            </label>
            <input
              id="chat-id"
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="e.g. 123456789"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {saveError && (
            <p className="text-sm text-red-500">{saveError}</p>
          )}
          {saveSuccess && (
            <p className="text-sm text-emerald-400">Chat ID saved successfully.</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || chatId.trim() === ''}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>

            {savedChatId && (
              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {testing ? 'Sending…' : 'Test Alert'}
              </button>
            )}
          </div>

          {testResult && (
            <p className={`text-sm ${testResult.ok ? 'text-emerald-400' : 'text-red-500'}`}>
              {testResult.message}
            </p>
          )}
        </form>
      </section>

      {/* Email Preferences */}
      {/* Slack integration */}
      <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 shadow-lg">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-lg font-semibold text-white">Slack Alerts</h2>
          {!canUseSlack && (
            <a href="/pricing" className="text-xs text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Pro / API only
            </a>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Receive signal alerts directly in your Slack channel via incoming webhook.
        </p>

        {canUseSlack ? (
          <form onSubmit={handleSaveSlack} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Slack Incoming Webhook URL</label>
              <input
                type="url"
                value={slackUrl}
                onChange={(e) => setSlackUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            {slackError && <p className="text-xs text-red-400">{slackError}</p>}
            {slackSuccess && <p className="text-xs text-emerald-400">Saved successfully!</p>}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={savingSlack}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {savingSlack ? 'Saving...' : 'Save'}
              </button>
              {savedSlackUrl && (
                <button
                  type="button"
                  onClick={handleTestSlack}
                  disabled={testingSlack}
                  className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors disabled:opacity-50"
                >
                  {testingSlack ? 'Testing...' : 'Test'}
                </button>
              )}
              {slackTestResult !== null && (
                <span className={`text-xs ${slackTestResult ? 'text-emerald-400' : 'text-red-400'}`}>
                  {slackTestResult ? '✓ Delivered' : '✗ Failed'}
                </span>
              )}
            </div>
          </form>
        ) : (
          <a href="/pricing" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-colors">
            Upgrade to Pro to enable Slack alerts →
          </a>
        )}
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-1">Email Preferences</h2>
        <p className="text-sm text-gray-500 mb-5">
          Control which email notifications you receive.
        </p>

        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={emailAlertsEnabled}
              disabled={savingEmail}
              onChange={(e) => handleEmailToggle(e.target.checked)}
            />
            <div
              className={`w-10 h-6 rounded-full transition-colors ${
                emailAlertsEnabled ? 'bg-emerald-500' : 'bg-gray-700'
              }`}
            />
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                emailAlertsEnabled ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
          <span className="text-sm font-medium text-gray-300">
            Daily signals digest email
          </span>
        </label>

        <p className="text-xs text-gray-500 mt-3">
          When enabled, you&apos;ll receive the daily signals digest at 8AM UTC.
          {savingEmail && <span className="ml-2 text-gray-600">Saving…</span>}
        </p>

        {/* Asset selection */}
        <div className="mt-5 pt-5 border-t border-gray-800">
          <p className="text-sm font-medium text-gray-300 mb-2">Alert assets</p>
          <p className="text-xs text-gray-500 mb-3">Only receive alerts for selected assets.</p>
          <div className="flex flex-wrap gap-2">
            {['BTC', 'ETH', 'SOL', 'XRP', 'DOGE'].map((asset) => (
              <button
                key={asset}
                onClick={() => handleAssetToggle(asset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  alertAssets.includes(asset)
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-gray-800 text-gray-600 border-gray-700 hover:border-gray-600'
                }`}
              >
                {asset}
              </button>
            ))}
          </div>
        </div>

        {/* Minimum confidence threshold */}
        <div className="mt-5 pt-5 border-t border-gray-800">
          <p className="text-sm font-medium text-gray-300 mb-2">Minimum confidence threshold</p>
          <p className="text-xs text-gray-500 mb-3">Only receive alerts for signals above this confidence level.</p>
          <div className="flex flex-wrap gap-2">
            {[0, 0.5, 0.6, 0.7, 0.8].map((v) => (
              <button
                key={v}
                onClick={() => handleMinConfidenceChange(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  minConfidence === v
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
                }`}
              >
                {v === 0 ? 'All signals' : `${v * 100}%+ confidence`}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
