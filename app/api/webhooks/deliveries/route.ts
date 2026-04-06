import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSubscription } from '@/lib/db';
import { getDeliveryHistoryForUser } from '@/lib/webhook-delivery';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sub = getSubscription(session.userId);
  if (!sub || sub.status !== 'active' || !['pro', 'api'].includes(sub.plan)) {
    return NextResponse.json({ error: 'Pro or API subscription required' }, { status: 403 });
  }

  const deliveries = getDeliveryHistoryForUser(session.userId, 50);
  return NextResponse.json({ deliveries });
}
