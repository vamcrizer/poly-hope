import { NextRequest, NextResponse } from 'next/server';
import { deliverToAllSubscribers } from '@/lib/webhook-delivery';
import { sendSlackSignals } from '@/lib/slack';
import { sendDiscordSignals } from '@/lib/discord';
import { sendSignalsEmail } from '@/lib/email';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ── Types ────────────────────────────────────────────────────────────────────

interface Kline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Signal {
  asset: string;
  direction: 'LONG' | 'SHORT';
  confidence: number;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  timeframe: string;
}

// ── Binance fetch ─────────────────────────────────────────────────────────────

async function fetchKlines(symbol: string, limit = 200): Promise<Kline[]> {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=15m&limit=${limit}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Binance fetch failed for ${symbol}: ${res.status}`);
  }
  // Each element: [openTime, open, high, low, close, volume, ...]
  const raw: string[][] = await res.json();
  return raw.map((k) => ({
    openTime: Number(k[0]),
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5]),
  }));
}

// ── Technical indicators ──────────────────────────────────────────────────────

function computeRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const delta = closes[i] - closes[i - 1];
    if (delta >= 0) gains += delta;
    else losses -= delta;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < closes.length; i++) {
    const delta = closes[i] - closes[i - 1];
    const gain = delta >= 0 ? delta : 0;
    const loss = delta < 0 ? -delta : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function computeMACDDirection(closes: number[]): 'bullish' | 'bearish' | 'neutral' {
  // Simple MACD: EMA12 - EMA26. Direction based on sign of MACD line.
  function ema(data: number[], period: number): number {
    const k = 2 / (period + 1);
    let val = data[0];
    for (let i = 1; i < data.length; i++) val = data[i] * k + val * (1 - k);
    return val;
  }

  if (closes.length < 26) return 'neutral';
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  const macd = ema12 - ema26;
  if (macd > 0) return 'bullish';
  if (macd < 0) return 'bearish';
  return 'neutral';
}

function computeBBPosition(closes: number[], period = 20): number {
  // Returns 0–1: 0 = at lower band, 1 = at upper band, 0.5 = at middle
  if (closes.length < period) return 0.5;
  const slice = closes.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((sum, v) => sum + (v - mean) ** 2, 0) / period;
  const stdDev = Math.sqrt(variance);
  const upper = mean + 2 * stdDev;
  const lower = mean - 2 * stdDev;
  const latest = closes[closes.length - 1];
  if (upper === lower) return 0.5;
  return Math.min(1, Math.max(0, (latest - lower) / (upper - lower)));
}

// ── Signal generation ─────────────────────────────────────────────────────────

function generateSignal(asset: string, klines: Kline[]): Signal | null {
  const closes = klines.map((k) => k.close);
  const latest = closes[closes.length - 1];

  const rsi = computeRSI(closes, 14);
  const macdDir = computeMACDDirection(closes);
  const bbPos = computeBBPosition(closes, 20);

  // No signal in neutral RSI zone
  if (rsi >= 40 && rsi <= 60) return null;

  let direction: 'LONG' | 'SHORT';
  if (rsi < 35) {
    direction = 'LONG';
  } else if (rsi > 65) {
    direction = 'SHORT';
  } else {
    return null;
  }

  // Confidence: normalized RSI distance from neutral (50), mapped to 0.55–0.85
  const rsiDistance = Math.abs(rsi - 50); // 0–50
  const normalized = Math.min(1, rsiDistance / 30); // 0–1 at rsi 80+
  const confidence = parseFloat((0.55 + normalized * 0.30).toFixed(4));

  // Agreement bonus: MACD + BB alignment boosts confidence
  const macdAgrees =
    (direction === 'LONG' && macdDir === 'bullish') ||
    (direction === 'SHORT' && macdDir === 'bearish');
  const bbAgrees =
    (direction === 'LONG' && bbPos < 0.25) ||
    (direction === 'SHORT' && bbPos > 0.75);
  const finalConfidence = parseFloat(
    Math.min(0.85, confidence + (macdAgrees ? 0.03 : 0) + (bbAgrees ? 0.02 : 0)).toFixed(4)
  );

  // Risk levels: simplified ATR using 1.5% / 3% of price
  const atrProxy = latest * 0.015;
  const entry_price = parseFloat(latest.toFixed(6));
  const stop_loss =
    direction === 'LONG'
      ? parseFloat((latest - atrProxy).toFixed(6))
      : parseFloat((latest + atrProxy).toFixed(6));
  const take_profit =
    direction === 'LONG'
      ? parseFloat((latest + atrProxy * 2).toFixed(6))
      : parseFloat((latest - atrProxy * 2).toFixed(6));

  return {
    asset,
    direction,
    confidence: finalConfidence,
    entry_price,
    stop_loss,
    take_profit,
    timeframe: '15m',
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────

const SYMBOLS: Record<string, string> = {
  BTCUSDT: 'BTC',
  ETHUSDT: 'ETH',
  SOLUSDT: 'SOL',
  XRPUSDT: 'XRP',
  DOGEUSDT: 'DOGE',
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!cronSecret || token !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const generated: Signal[] = [];
  const errors: string[] = [];

  // Fetch + compute signals for all symbols concurrently
  const results = await Promise.allSettled(
    Object.entries(SYMBOLS).map(async ([binanceSymbol, assetName]) => {
      const klines = await fetchKlines(binanceSymbol);
      const signal = generateSignal(assetName, klines);
      return { assetName, signal };
    })
  );

  for (const result of results) {
    if (result.status === 'rejected') {
      errors.push(String(result.reason));
      continue;
    }
    const { signal } = result.value;
    if (signal) generated.push(signal);
  }

  // Persist signals via the admin signals endpoint
  let savedCount = 0;
  if (generated.length > 0) {
    try {
      const adminSecret = process.env.ADMIN_SECRET;
      if (!adminSecret) throw new Error('ADMIN_SECRET not configured');

      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

      const saveRes = await fetch(`${appUrl}/api/admin/signals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify(generated),
      });

      if (saveRes.ok) {
        const saveData = (await saveRes.json()) as { inserted?: number };
        savedCount = saveData.inserted ?? generated.length;
      } else {
        const errText = await saveRes.text();
        errors.push(`Failed to save signals: ${saveRes.status} ${errText}`);
      }
    } catch (err) {
      errors.push(`Save error: ${String(err)}`);
    }
  }

  // Deliver to webhook + Slack subscribers (fire-and-forget, non-blocking)
  if (generated.length > 0) {
    const now = new Date().toISOString();
    const signalsWithTimestamp = generated.map((s) => ({ ...s, generated_at: now }));

    // Webhook delivery
    deliverToAllSubscribers(signalsWithTimestamp).catch((err) => {
      console.error('[cron/signals] webhook delivery error:', err);
    });

    // Slack delivery — notify all Pro/API subscribers with Slack configured
    try {
      const slackUsers = db.prepare(`
        SELECT us.slack_webhook_url
        FROM user_settings us
        JOIN subscriptions s ON s.user_id = us.user_id
        WHERE us.slack_webhook_url IS NOT NULL
          AND s.status = 'active'
          AND s.plan IN ('pro', 'api')
      `).all() as { slack_webhook_url: string }[];

      for (const row of slackUsers) {
        sendSlackSignals(row.slack_webhook_url, generated).catch(() => {});
      }
    } catch (err) {
      console.error('[cron/signals] slack delivery error:', err);
    }

    // Discord delivery — Pro/API subscribers with discord_webhook_url
    try {
      const discordUsers = db.prepare(`
        SELECT us.discord_webhook_url
        FROM user_settings us
        JOIN subscriptions s ON s.user_id = us.user_id
        WHERE us.discord_webhook_url IS NOT NULL
          AND s.status = 'active'
          AND s.plan IN ('pro', 'api')
      `).all() as { discord_webhook_url: string }[];

      const now2 = new Date().toISOString();
      const generatedWithTs = generated.map((s) => ({ ...s, generated_at: now2 }));
      for (const row of discordUsers) {
        sendDiscordSignals(row.discord_webhook_url, generatedWithTs as any).catch(() => {});
      }
    } catch (err) {
      console.error('[cron/signals] discord delivery error:', err);
    }

    // Email digest — all active subscribers with email_alerts_enabled
    try {
      const emailUsers = db.prepare(`
        SELECT u.email,
          COALESCE(us.min_confidence, 0) AS min_confidence,
          COALESCE(us.alert_assets, 'BTC,ETH,SOL,XRP,DOGE') AS alert_assets
        FROM users u
        JOIN subscriptions s ON s.user_id = u.id
        LEFT JOIN user_settings us ON us.user_id = u.id
        WHERE s.status = 'active'
          AND (us.email_alerts_enabled IS NULL OR us.email_alerts_enabled = 1)
      `).all() as { email: string; min_confidence: number; alert_assets: string }[];

      for (const user of emailUsers) {
        const allowed = user.alert_assets.split(',').map((a) => a.trim().toUpperCase());
        let filtered = generated.filter((s) => allowed.includes(s.asset.toUpperCase()));
        if (user.min_confidence > 0) filtered = filtered.filter((s) => s.confidence >= user.min_confidence);
        if (filtered.length === 0) continue;
        sendSignalsEmail(user.email, filtered as any).catch(() => {});
      }
    } catch (err) {
      console.error('[cron/signals] email delivery error:', err);
    }
  }

  return NextResponse.json({
    success: errors.length === 0 || savedCount > 0,
    signals_generated: savedCount,
    signals_attempted: generated.length,
    timestamp: new Date().toISOString(),
    ...(errors.length > 0 ? { errors } : {}),
  });
}
