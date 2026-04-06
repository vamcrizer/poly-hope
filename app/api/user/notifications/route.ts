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
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { email_alerts_enabled } = body as { email_alerts_enabled?: boolean };

  if (typeof email_alerts_enabled !== 'boolean') {
    return NextResponse.json({ error: 'email_alerts_enabled must be a boolean' }, { status: 400 });
  }

  upsertUserSettings(session.userId, { email_alerts_enabled: email_alerts_enabled ? 1 : 0 });
  return NextResponse.json({ success: true, email_alerts_enabled });
}
