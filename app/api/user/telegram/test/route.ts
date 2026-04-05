import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserSettings } from '@/lib/db-extras';
import { sendMessage } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = getUserSettings(session.userId);

  if (!settings?.telegram_chat_id) {
    return NextResponse.json(
      { success: false, error: 'No Telegram chat ID configured' },
      { status: 400 },
    );
  }

  const ok = await sendMessage(
    settings.telegram_chat_id,
    '✅ Polymarket Signals test notification! Your alerts are working.',
  );

  if (!ok) {
    return NextResponse.json(
      { success: false, error: 'Failed to send Telegram message. Check your chat ID and bot token.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
