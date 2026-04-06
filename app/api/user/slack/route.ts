import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSubscription } from '@/lib/db';
import { getUserSettings, upsertUserSettings } from '@/lib/db-extras';
import { sendSlackSignals } from '@/lib/slack';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function requireProSub(request: NextRequest) {
  return getSession(request).then(async (session) => {
    if (!session) return null;
    const sub = getSubscription(session.userId);
    if (!sub || sub.status !== 'active' || !['pro', 'api'].includes(sub.plan)) return null;
    return session;
  });
}

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const settings = getUserSettings(session.userId);
  return NextResponse.json({ slack_webhook_url: settings?.slack_webhook_url ?? null });
}

export async function POST(request: NextRequest) {
  const session = await requireProSub(request);
  if (!session) {
    return NextResponse.json({ error: 'Pro or API subscription required' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const { slack_webhook_url } = body as { slack_webhook_url?: string };

  if (slack_webhook_url !== null && slack_webhook_url !== undefined) {
    if (slack_webhook_url !== '' && !slack_webhook_url.startsWith('https://hooks.slack.com/')) {
      return NextResponse.json({ error: 'Invalid Slack webhook URL' }, { status: 400 });
    }
    upsertUserSettings(session.userId, { slack_webhook_url: slack_webhook_url || null });
  }

  return NextResponse.json({ success: true });
}

// DELETE — remove Slack integration
export async function DELETE(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  upsertUserSettings(session.userId, { slack_webhook_url: null });
  return NextResponse.json({ success: true });
}

// Test the Slack webhook
export async function PUT(request: NextRequest) {
  const session = await requireProSub(request);
  if (!session) {
    return NextResponse.json({ error: 'Pro or API subscription required' }, { status: 403 });
  }

  const settings = getUserSettings(session.userId);
  if (!settings?.slack_webhook_url) {
    return NextResponse.json({ error: 'No Slack webhook configured' }, { status: 400 });
  }

  const ok = await sendSlackSignals(settings.slack_webhook_url, [
    {
      asset: 'BTC',
      direction: 'LONG',
      confidence: 0.78,
      entry_price: 83200,
      stop_loss: 81000,
      take_profit: 87500,
      timeframe: '15m',
    },
  ]);

  return NextResponse.json({ success: ok });
}
