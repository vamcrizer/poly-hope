import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserSettings, upsertUserSettings } from '@/lib/db-extras';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const settings = getUserSettings(session.userId);
  return NextResponse.json({
    email_alerts_enabled: settings ? settings.email_alerts_enabled === 1 : true,
    min_confidence: settings?.min_confidence ?? 0,
    alert_assets: settings?.alert_assets ?? 'BTC,ETH,SOL,XRP,DOGE',
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { email_alerts_enabled, min_confidence, alert_assets } = body as {
    email_alerts_enabled?: boolean;
    min_confidence?: number;
    alert_assets?: string;
  };

  const updates: Parameters<typeof upsertUserSettings>[1] = {};
  if (typeof email_alerts_enabled === 'boolean') updates.email_alerts_enabled = email_alerts_enabled ? 1 : 0;
  if (typeof min_confidence === 'number' && min_confidence >= 0 && min_confidence <= 1) updates.min_confidence = min_confidence;
  if (typeof alert_assets === 'string' && alert_assets.length > 0) updates.alert_assets = alert_assets;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  upsertUserSettings(session.userId, updates);
  return NextResponse.json({ success: true });
}
