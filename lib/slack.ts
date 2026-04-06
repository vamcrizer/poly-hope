/**
 * Slack incoming webhook integration.
 * Sends signal notifications to a user-configured Slack channel.
 */

export interface SlackSignal {
  asset: string;
  direction: 'LONG' | 'SHORT';
  confidence: number;
  entry_price?: number;
  stop_loss?: number;
  take_profit?: number;
  timeframe?: string;
}

function formatSlackMessage(signals: SlackSignal[]): object {
  const emoji = (direction: 'LONG' | 'SHORT') => direction === 'LONG' ? '📈' : '📉';
  const confPct = (c: number) => `${Math.round(c * 100)}%`;

  const lines = signals.map((s) => {
    const parts = [`*${s.asset}* ${emoji(s.direction)} ${s.direction} — ${confPct(s.confidence)} confidence`];
    if (s.entry_price) parts.push(`Entry: $${s.entry_price.toLocaleString()}`);
    if (s.stop_loss) parts.push(`SL: $${s.stop_loss.toLocaleString()}`);
    if (s.take_profit) parts.push(`TP: $${s.take_profit.toLocaleString()}`);
    if (s.timeframe) parts.push(`TF: ${s.timeframe}`);
    return parts.join(' · ');
  });

  return {
    text: `🔔 *Polymarket Signals — Daily Update*\n\n${lines.join('\n')}\n\n_Generated at ${new Date().toUTCString()}_`,
    unfurl_links: false,
    unfurl_media: false,
  };
}

export async function sendSlackSignals(webhookUrl: string, signals: SlackSignal[]): Promise<boolean> {
  if (!webhookUrl || signals.length === 0) return false;

  const body = formatSlackMessage(signals);
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}
