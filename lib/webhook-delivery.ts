import { createHmac } from 'crypto';
import db from '@/lib/db';
import type { Signal } from '@/types';

// Minimal shape required for webhook payloads — compatible with both the
// types/index Signal (has generated_at) and the cron-local Signal (no generated_at).
export type SignalLike = {
  asset: string;
  direction: 'LONG' | 'SHORT';
  confidence: number;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  timeframe: string;
  generated_at?: string;
  id?: number;
};

// ─── Schema ───────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS webhooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    events TEXT NOT NULL DEFAULT '[]',
    secret TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// ─── Types ────────────────────────────────────────────────────────────────────

export type WebhookEvent = 'signal.generated' | 'signal.expired';

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: SignalLike | SignalLike[];
}

export interface Webhook {
  id: number;
  user_id: number;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'inactive';
  created_at: string;
}

interface WebhookRow {
  id: number;
  user_id: number;
  url: string;
  events: string;
  secret: string;
  status: string;
  created_at: string;
}

// ─── DB helpers ───────────────────────────────────────────────────────────────

export function getWebhooksForUser(userId: number): Webhook[] {
  const rows = db
    .prepare('SELECT * FROM webhooks WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId) as WebhookRow[];
  return rows.map(rowToWebhook);
}

export function getWebhookById(id: number, userId: number): Webhook | undefined {
  const row = db
    .prepare('SELECT * FROM webhooks WHERE id = ? AND user_id = ?')
    .get(id, userId) as WebhookRow | undefined;
  return row ? rowToWebhook(row) : undefined;
}

export function createWebhook(params: {
  userId: number;
  url: string;
  events: string[];
  secret: string;
}): Webhook {
  const result = db
    .prepare(
      `INSERT INTO webhooks (user_id, url, events, secret, status)
       VALUES (?, ?, ?, ?, 'active')
       RETURNING *`
    )
    .get(params.userId, params.url, JSON.stringify(params.events), params.secret) as WebhookRow;
  return rowToWebhook(result);
}

export function deleteWebhook(id: number, userId: number): boolean {
  const info = db
    .prepare('DELETE FROM webhooks WHERE id = ? AND user_id = ?')
    .run(id, userId);
  return info.changes > 0;
}

function getActiveWebhooksForEvent(event: WebhookEvent): WebhookRow[] {
  return db
    .prepare(`SELECT * FROM webhooks WHERE status = 'active'`)
    .all() as WebhookRow[];
}

function rowToWebhook(row: WebhookRow): Webhook {
  let events: string[] = [];
  try {
    events = JSON.parse(row.events);
  } catch {
    events = [];
  }
  return {
    id: row.id,
    user_id: row.user_id,
    url: row.url,
    events,
    secret: row.secret,
    status: row.status as 'active' | 'inactive',
    created_at: row.created_at,
  };
}

// ─── Delivery ─────────────────────────────────────────────────────────────────

function signPayload(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('hex');
}

async function attemptDelivery(
  url: string,
  body: string,
  signature: string
): Promise<{ ok: boolean; status?: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Polymarket-Signature': `sha256=${signature}`,
      },
      body,
      signal: controller.signal,
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}

export async function deliverWebhook(
  url: string,
  payload: WebhookPayload,
  secret?: string
): Promise<boolean> {
  const body = JSON.stringify(payload);
  const sig = secret ? signPayload(body, secret) : '';

  const delays = [0, 1000, 2000, 4000];

  for (let attempt = 0; attempt < 3; attempt++) {
    if (delays[attempt] > 0) {
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }

    const result = await attemptDelivery(url, body, sig);
    if (result.ok) return true;
  }

  return false;
}

export async function deliverToAllSubscribers(signals: SignalLike[]): Promise<void> {
  if (signals.length === 0) return;

  const rows = getActiveWebhooksForEvent('signal.generated');
  if (rows.length === 0) return;

  const payload: WebhookPayload = {
    event: 'signal.generated',
    timestamp: new Date().toISOString(),
    data: signals,
  };

  await Promise.allSettled(
    rows.map((row) => {
      const webhook = rowToWebhook(row);
      if (!webhook.events.includes('signal.generated')) return Promise.resolve(false);
      return deliverWebhook(webhook.url, payload, webhook.secret);
    })
  );
}
