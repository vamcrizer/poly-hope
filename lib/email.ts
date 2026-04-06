import nodemailer from 'nodemailer';
import type { Signal } from '@/types';

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? 'Polymarket Signals <signals@polymarketsignals.com>';

  if (!host || !user || !pass) {
    throw new Error('SMTP_HOST, SMTP_USER, SMTP_PASS env vars are required for email delivery');
  }

  const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  return { transporter, from };
}

function formatSignalHtml(signals: Signal[]): string {
  const rows = signals.map((s) => {
    const dir = s.direction === 'LONG'
      ? '<span style="color:#10b981;font-weight:bold;">LONG ▲</span>'
      : '<span style="color:#ef4444;font-weight:bold;">SHORT ▼</span>';
    const conf = Math.round(s.confidence * 100);
    const fmt = (v: number | null) => v != null ? `$${v.toLocaleString(undefined, { maximumFractionDigits: 4 })}` : '—';
    return `
      <tr style="border-bottom:1px solid #1f2937;">
        <td style="padding:10px 12px;font-weight:700;color:#fff;">${s.asset}</td>
        <td style="padding:10px 12px;">${dir}</td>
        <td style="padding:10px 12px;color:#9ca3af;">${conf}%</td>
        <td style="padding:10px 12px;color:#d1d5db;font-family:monospace;">${fmt(s.entry_price)}</td>
        <td style="padding:10px 12px;color:#ef4444;font-family:monospace;">${fmt(s.stop_loss)}</td>
        <td style="padding:10px 12px;color:#10b981;font-family:monospace;">${fmt(s.take_profit)}</td>
      </tr>`;
  }).join('');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://polymarketsignals.com';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#d1d5db;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;padding:32px 16px;">
    <tr><td>
      <!-- Header -->
      <div style="margin-bottom:28px;">
        <div style="font-size:13px;color:#10b981;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:8px;">
          Daily Signals · ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff;">
          Today's Polymarket Signals
        </h1>
        <p style="margin:8px 0 0;font-size:14px;color:#6b7280;">
          ${signals.length} signal${signals.length !== 1 ? 's' : ''} generated at 8AM UTC · BTC · ETH · SOL · XRP · DOGE
        </p>
      </div>

      <!-- Table -->
      <div style="background:#111827;border:1px solid #1f2937;border-radius:12px;overflow:hidden;margin-bottom:28px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
          <thead>
            <tr style="background:#0f172a;border-bottom:1px solid #1f2937;">
              <th style="padding:10px 12px;text-align:left;color:#6b7280;font-weight:500;text-transform:uppercase;font-size:11px;letter-spacing:0.05em;">Asset</th>
              <th style="padding:10px 12px;text-align:left;color:#6b7280;font-weight:500;text-transform:uppercase;font-size:11px;letter-spacing:0.05em;">Dir</th>
              <th style="padding:10px 12px;text-align:left;color:#6b7280;font-weight:500;text-transform:uppercase;font-size:11px;letter-spacing:0.05em;">Conf</th>
              <th style="padding:10px 12px;text-align:left;color:#6b7280;font-weight:500;text-transform:uppercase;font-size:11px;letter-spacing:0.05em;">Entry</th>
              <th style="padding:10px 12px;text-align:left;color:#6b7280;font-weight:500;text-transform:uppercase;font-size:11px;letter-spacing:0.05em;">Stop</th>
              <th style="padding:10px 12px;text-align:left;color:#6b7280;font-weight:500;text-transform:uppercase;font-size:11px;letter-spacing:0.05em;">Target</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>

      <!-- Methodology note -->
      <div style="background:#0f172a;border:1px solid #1f2937;border-radius:10px;padding:16px;margin-bottom:24px;font-size:13px;color:#6b7280;">
        <strong style="color:#9ca3af;">How signals are generated:</strong>
        RSI (14) + MACD + Bollinger Bands on 15-minute Binance OHLCV data.
        Stop = 1× ATR · Target = 2.5× ATR.
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:32px;">
        <a href="${appUrl}/dashboard"
          style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;padding:12px 32px;border-radius:10px;font-weight:600;font-size:14px;">
          View Dashboard →
        </a>
      </div>

      <!-- Footer -->
      <div style="font-size:12px;color:#4b5563;text-align:center;border-top:1px solid #1f2937;padding-top:20px;">
        <p style="margin:0 0 8px;">Polymarket Signals · These are not financial advice. Trade at your own risk.</p>
        <a href="${appUrl}/dashboard/settings" style="color:#6b7280;text-decoration:underline;">Manage email preferences</a>
        &nbsp;·&nbsp;
        <a href="${appUrl}/dashboard/settings" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>
      </div>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendSignalsEmail(to: string, signals: Signal[]): Promise<boolean> {
  try {
    const { transporter, from } = getTransport();
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    await transporter.sendMail({
      from,
      to,
      subject: `Daily Polymarket Signals — ${date} · ${signals.length} signal${signals.length !== 1 ? 's' : ''}`,
      html: formatSignalHtml(signals),
    });
    return true;
  } catch (err) {
    console.error('[email] sendSignalsEmail error:', err);
    return false;
  }
}

export async function sendWelcomeEmail(to: string): Promise<boolean> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://polymarketsignals.com';
  try {
    const { transporter, from } = getTransport();
    await transporter.sendMail({
      from,
      to,
      subject: 'Welcome to Polymarket Signals 🎯',
      html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:32px 16px;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#d1d5db;max-width:520px;margin:0 auto;">
  <div style="margin-bottom:24px;">
    <div style="font-size:13px;color:#10b981;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:8px;">Welcome aboard</div>
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fff;">Your free trial starts now</h1>
    <p style="margin:0;font-size:14px;color:#6b7280;">You have 7 days of full access to all Polymarket Signals features.</p>
  </div>
  <div style="background:#111827;border:1px solid #1f2937;border-radius:12px;padding:20px;margin-bottom:24px;">
    <ul style="margin:0;padding:0;list-style:none;font-size:14px;">
      <li style="padding:6px 0;border-bottom:1px solid #1f2937;">✅ &nbsp;Daily signals: BTC, ETH, SOL, XRP, DOGE</li>
      <li style="padding:6px 0;border-bottom:1px solid #1f2937;">✅ &nbsp;Entry, Stop Loss, Take Profit levels</li>
      <li style="padding:6px 0;border-bottom:1px solid #1f2937;">✅ &nbsp;Telegram alerts (connect in settings)</li>
      <li style="padding:6px 0;">✅ &nbsp;CSV export &amp; signal history</li>
    </ul>
  </div>
  <div style="text-align:center;margin-bottom:32px;">
    <a href="${appUrl}/dashboard"
      style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;padding:12px 32px;border-radius:10px;font-weight:600;font-size:14px;">
      Go to Dashboard →
    </a>
  </div>
  <p style="font-size:12px;color:#4b5563;text-align:center;">
    Polymarket Signals · Not financial advice. Trade at your own risk.
  </p>
</body>
</html>`,
    });
    return true;
  } catch (err) {
    console.error('[email] sendWelcomeEmail error:', err);
    return false;
  }
}
