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
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(false);

  useEffect(() => {
    fetch('/api/user/telegram')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load settings');
        return res.json() as Promise<TelegramStatus>;
      })
      .then((data) => {
        setSavedChatId(data.telegram_chat_id);
        if (data.telegram_chat_id) setChatId(data.telegram_chat_id);
      })
      .catch(console.error)
      .finally(() => setLoadingStatus(false));
  }, []);

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
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Telegram Alerts */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold">Telegram Alerts</h2>
          {!loadingStatus && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                savedChatId
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {savedChatId ? 'Enabled' : 'Not configured'}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Receive trade signals directly in Telegram.
        </p>

        <ol className="text-sm text-gray-700 space-y-1 mb-5 list-decimal list-inside">
          <li>
            Start{' '}
            <a
              href="https://t.me/PolySignalsBot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline font-medium"
            >
              @PolySignalsBot
            </a>{' '}
            on Telegram.
          </li>
          <li>Send <code className="bg-gray-100 rounded px-1">/start</code> to the bot.</li>
          <li>The bot will reply with your chat ID. Copy it.</li>
          <li>Paste your chat ID below and save.</li>
        </ol>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="chat-id" className="block text-sm font-medium text-gray-700 mb-1">
              Telegram Chat ID
            </label>
            <input
              id="chat-id"
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="e.g. 123456789"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {saveError && (
            <p className="text-sm text-red-600">{saveError}</p>
          )}
          {saveSuccess && (
            <p className="text-sm text-green-600">Chat ID saved successfully.</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || chatId.trim() === ''}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>

            {savedChatId && (
              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {testing ? 'Sending…' : 'Test Alert'}
              </button>
            )}
          </div>

          {testResult && (
            <p className={`text-sm ${testResult.ok ? 'text-green-600' : 'text-red-600'}`}>
              {testResult.message}
            </p>
          )}
        </form>
      </section>

      {/* Email Preferences */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-1">Email Preferences</h2>
        <p className="text-sm text-gray-500 mb-5">
          Control which email notifications you receive.
        </p>

        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={emailAlertsEnabled}
              onChange={(e) => setEmailAlertsEnabled(e.target.checked)}
            />
            <div
              className={`w-10 h-6 rounded-full transition-colors ${
                emailAlertsEnabled ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            />
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                emailAlertsEnabled ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            Daily signals digest email
          </span>
        </label>

        <p className="text-xs text-gray-400 mt-3">
          Full email alert configuration coming soon.
        </p>
      </section>
    </div>
  );
}
