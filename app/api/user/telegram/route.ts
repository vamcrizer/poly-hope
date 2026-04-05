import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserSettings, upsertUserSettings } from '@/lib/db-extras';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = getUserSettings(session.userId);
  return NextResponse.json({
    success: true,
    telegram_chat_id: settings?.telegram_chat_id ?? null,
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { chat_id } = body as { chat_id?: string };

  if (!chat_id || typeof chat_id !== 'string' || chat_id.trim() === '') {
    return NextResponse.json({ error: 'chat_id is required' }, { status: 400 });
  }

  upsertUserSettings(session.userId, { telegram_chat_id: chat_id.trim() });

  return NextResponse.json({ success: true });
}
