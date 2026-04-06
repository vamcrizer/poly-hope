import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSubscription } from '@/lib/db';
import { getUserSettings, upsertUserSettings } from '@/lib/db-extras';
import { sendDiscordSignals } from '@/lib/discord';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function requireProSub(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return null;
  const sub = getSubscription(session.userId);
  if (!sub || sub.status !== 'active' || !['pro', 'api'].includes(sub.plan)) return null;
  return session;
}

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const settings = getUserSettings(session.userId);
  return NextResponse.json({ discord_webhook_url: settings?.discord_webhook_url ?? null });
}

export async function POST(request: NextRequest) {
  const session = await requireProSub(request);
  if (!session) {
    return NextResponse.json({ error: 'Pro or API subscription required' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const { discord_webhook_url } = body as { discord_webhook_url?: string };

  if (discord_webhook_url !== null && discord_webhook_url !== undefined) {
    if (
      discord_webhook_url !== '' &&
      !discord_webhook_url.startsWith('https://discord.com/api/webhooks/') &&
      !discord_webhook_url.startsWith('https://discordapp.com/api/webhooks/')
    ) {
      return NextResponse.json({ error: 'Invalid Discord webhook URL' }, { status: 400 });
    }
    upsertUserSettings(session.userId, { discord_webhook_url: discord_webhook_url || null });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  upsertUserSettings(session.userId, { discord_webhook_url: null });
  return NextResponse.json({ success: true });
}

// PUT — test Discord webhook with a sample signal
export async function PUT(request: NextRequest) {
  const session = await requireProSub(request);
  if (!session) {
    return NextResponse.json({ error: 'Pro or API subscription required' }, { status: 403 });
  }

  const settings = getUserSettings(session.userId);
  if (!settings?.discord_webhook_url) {
    return NextResponse.json({ error: 'No Discord webhook configured' }, { status: 400 });
  }

  const ok = await sendDiscordSignals(settings.discord_webhook_url, [
    {
      asset: 'BTC',
      direction: 'LONG',
      confidence: 0.78,
      entry_price: 83200,
      stop_loss: 81000,
      take_profit: 87500,
      timeframe: '15m',
      generated_at: new Date().toISOString(),
    } as any,
  ]);

  return NextResponse.json({ success: ok });
}
