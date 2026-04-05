import type { Signal } from '@/types';

const BOT_API_BASE = 'https://api.telegram.org';

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  return token;
}

export async function sendMessage(chatId: string, text: string): Promise<boolean> {
  const token = getBotToken();
  const url = `${BOT_API_BASE}/bot${token}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[telegram] sendMessage error:', res.status, body);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[telegram] sendMessage fetch error:', err);
    return false;
  }
}

function formatPrice(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  if (value >= 1000) return `$${value.toLocaleString('en-US')}`;
  return `$${value}`;
}

function formatConfidence(value: number): string {
  const pct = Math.round(value * 100);
  return `${pct}%`;
}

export async function sendSignalsDigest(chatId: string, signals: Signal[]): Promise<boolean> {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

  const lines: string[] = [
    '<b>📊 Polymarket Signals — Daily Digest</b>',
    `Updated: ${now}`,
    '',
  ];

  if (signals.length === 0) {
    lines.push('No active signals at this time.');
  } else {
    for (const signal of signals) {
      const icon = signal.direction === 'LONG' ? '🟢' : '🔴';
      const confidence = formatConfidence(signal.confidence);
      const entry = formatPrice(signal.entry_price);
      const sl = formatPrice(signal.stop_loss);
      const tp = formatPrice(signal.take_profit);
      const tf = signal.timeframe ?? 'N/A';

      lines.push(
        `${icon} <b>${signal.asset} ${signal.direction}</b> | ${confidence} confidence`,
        `Entry: ${entry} | SL: ${sl} | TP: ${tp} | ${tf}`,
        '',
      );
    }
  }

  const text = lines.join('\n').trimEnd();
  return sendMessage(chatId, text);
}
