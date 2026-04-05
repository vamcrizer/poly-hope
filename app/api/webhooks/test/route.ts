import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSubscription } from '@/lib/db';
import { getWebhookById, deliverWebhook } from '@/lib/webhook-delivery';
import type { WebhookPayload } from '@/lib/webhook-delivery';

export const dynamic = 'force-dynamic';

const DUMMY_SIGNAL = {
  id: 0,
  asset: 'BTC',
  direction: 'LONG' as const,
  confidence: 0.82,
  entry_price: 65000,
  stop_loss: 64025,
  take_profit: 66950,
  timeframe: '15m',
  generated_at: new Date().toISOString(),
};

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sub = getSubscription(session.userId);
  if (!sub || sub.status !== 'active' || !['pro', 'api'].includes(sub.plan)) {
    return NextResponse.json(
      { error: 'Pro or API subscription required' },
      { status: 403 }
    );
  }

  let body: { webhook_id?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const webhookId = Number(body.webhook_id);
  if (!webhookId || isNaN(webhookId)) {
    return NextResponse.json({ error: 'webhook_id is required' }, { status: 400 });
  }

  const webhook = getWebhookById(webhookId, session.userId);
  if (!webhook) {
    return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
  }

  const payload: WebhookPayload = {
    event: 'signal.generated',
    timestamp: new Date().toISOString(),
    data: DUMMY_SIGNAL,
  };

  const startMs = Date.now();
  let success = false;
  let statusCode: number | undefined;

  try {
    const body = JSON.stringify(payload);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Polymarket-Signature': `sha256=test`,
          'X-Polymarket-Test': '1',
        },
        body,
        signal: controller.signal,
      });
      success = res.ok;
      statusCode = res.status;
    } finally {
      clearTimeout(timer);
    }
  } catch {
    success = false;
  }

  const responseTimeMs = Date.now() - startMs;

  return NextResponse.json({
    success,
    ...(statusCode !== undefined ? { status_code: statusCode } : {}),
    response_time_ms: responseTimeMs,
  });
}
