import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getSession } from '@/lib/auth';
import { getSubscription } from '@/lib/db';
import {
  createWebhook,
  deleteWebhook,
  getWebhooksForUser,
  getWebhookById,
} from '@/lib/webhook-delivery';

export const dynamic = 'force-dynamic';

const ALLOWED_EVENTS = ['signal.generated', 'signal.expired'];

async function requireProSession(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return { error: 'Unauthorized', status: 401, session: null };

  const sub = getSubscription(session.userId);
  if (!sub || sub.status !== 'active' || !['pro', 'api'].includes(sub.plan)) {
    return { error: 'Pro or API subscription required', status: 403, session: null };
  }

  return { error: null, status: 200, session };
}

// ─── GET — list webhooks ──────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { error, status, session } = await requireProSession(request);
  if (error || !session) {
    return NextResponse.json({ error }, { status });
  }

  const webhooks = getWebhooksForUser(session.userId).map((w) => ({
    id: w.id,
    url: w.url,
    events: w.events,
    status: w.status,
    created_at: w.created_at,
  }));

  return NextResponse.json({ webhooks });
}

// ─── POST — create webhook ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const { error, status, session } = await requireProSession(request);
  if (error || !session) {
    return NextResponse.json({ error }, { status });
  }

  let body: { url?: unknown; events?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { url, events } = body;

  if (typeof url !== 'string' || !url.startsWith('https://')) {
    return NextResponse.json(
      { error: 'url must be a valid HTTPS URL' },
      { status: 400 }
    );
  }

  if (!Array.isArray(events) || events.length === 0) {
    return NextResponse.json(
      { error: 'events must be a non-empty array' },
      { status: 400 }
    );
  }

  const invalidEvents = (events as string[]).filter(
    (e) => !ALLOWED_EVENTS.includes(e)
  );
  if (invalidEvents.length > 0) {
    return NextResponse.json(
      { error: `Unknown events: ${invalidEvents.join(', ')}. Allowed: ${ALLOWED_EVENTS.join(', ')}` },
      { status: 400 }
    );
  }

  const secret = randomBytes(32).toString('hex');

  const webhook = createWebhook({
    userId: session.userId,
    url,
    events: events as string[],
    secret,
  });

  return NextResponse.json({
    id: String(webhook.id),
    url: webhook.url,
    events: webhook.events,
    status: webhook.status,
    secret,
  });
}

// ─── DELETE — remove webhook ──────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  const { error, status, session } = await requireProSession(request);
  if (error || !session) {
    return NextResponse.json({ error }, { status });
  }

  let body: { id?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const id = Number(body.id);
  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const existing = getWebhookById(id, session.userId);
  if (!existing) {
    return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
  }

  const deleted = deleteWebhook(id, session.userId);
  if (!deleted) {
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
