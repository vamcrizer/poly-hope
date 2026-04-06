import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSubscription } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sub = getSubscription(session.userId);
  if (!sub) return NextResponse.json(null);

  return NextResponse.json({
    plan: sub.plan,
    status: sub.status,
    current_period_end: sub.current_period_end,
    stripe_subscription_id: sub.stripe_subscription_id ? '***' : null,
  });
}
