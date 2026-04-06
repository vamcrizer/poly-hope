import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserSettings } from '@/lib/db-extras';
import { sendSignalsDigest } from '@/lib/telegram';
import { getLatestSignals } from '@/lib/db';
import type { Signal } from '@/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET;
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!adminSecret || token !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const signals = getLatestSignals() as unknown as Signal[];
  if (signals.length === 0) {
    return NextResponse.json({ success: false, error: 'No signals available' });
  }

  // Get all users with telegram connected
  const usersWithTelegram = db.prepare(`
    SELECT u.id, u.email, us.telegram_chat_id, us.email_alerts_enabled
    FROM users u
    JOIN user_settings us ON us.user_id = u.id
    JOIN subscriptions s ON s.user_id = u.id
    WHERE us.telegram_chat_id IS NOT NULL
    AND s.status = 'active'
    AND (us.email_alerts_enabled IS NULL OR us.email_alerts_enabled = 1)
  `).all() as Array<{ id: number; email: string; telegram_chat_id: string; email_alerts_enabled: number }>;

  let sent = 0;
  let errors = 0;

  await Promise.allSettled(
    usersWithTelegram.map(async (user) => {
      try {
        await sendSignalsDigest(user.telegram_chat_id, signals);
        sent++;
      } catch {
        errors++;
      }
    })
  );

  return NextResponse.json({ success: true, sent, errors, total_users: usersWithTelegram.length, signals_count: signals.length });
}
