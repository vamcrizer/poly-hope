import type { Signal } from '@/types';

function formatPrice(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 4 })}`;
}

export async function sendDiscordSignals(webhookUrl: string, signals: Signal[]): Promise<boolean> {
  if (!signals.length) return true;

  const embeds = signals.map((s) => {
    const isLong = s.direction === 'LONG';
    const color = isLong ? 0x10b981 : 0xef4444; // emerald or red
    const conf = Math.round(s.confidence * 100);

    return {
      color,
      title: `${s.asset} · ${s.direction} ${isLong ? '▲' : '▼'}`,
      fields: [
        { name: 'Confidence', value: `${conf}%`, inline: true },
        { name: 'Timeframe', value: s.timeframe ?? '15m', inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: 'Entry', value: formatPrice(s.entry_price), inline: true },
        { name: 'Stop Loss', value: formatPrice(s.stop_loss), inline: true },
        { name: 'Take Profit', value: formatPrice(s.take_profit), inline: true },
      ],
      footer: { text: 'Polymarket Signals · 2.5:1 risk-reward · Not financial advice' },
      timestamp: new Date().toISOString(),
    };
  });

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Polymarket Signals',
        avatar_url: 'https://polymarketsignals.com/icon-192.png',
        content: `📊 **Daily Signals** — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`,
        embeds,
      }),
    });

    if (!res.ok) {
      console.error('[discord] webhook error:', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('[discord] sendDiscordSignals error:', err);
    return false;
  }
}
