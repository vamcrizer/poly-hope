import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSubscription, getLatestSignals } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscription = getSubscription(session.userId);
  if (!subscription || subscription.status !== 'active') {
    return NextResponse.json({ error: 'Active subscription required' }, { status: 403 });
  }

  const signals = getLatestSignals();

  const today = new Date().toISOString().split('T')[0];
  const history = signals.length > 0
    ? [{ date: today, signals }]
    : [];

  return NextResponse.json({ history });
}
