import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSubscription, getLatestSignals } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const subscription = getSubscription(session.userId);
  if (!subscription || subscription.status !== 'active') {
    return NextResponse.json({ error: 'Subscription required' }, { status: 403 });
  }

  const signals = getLatestSignals();

  const header = 'asset,direction,confidence,entry_price,stop_loss,take_profit,timeframe,generated_at';
  const rows = signals.map((s) =>
    [
      s.asset,
      s.direction,
      s.confidence,
      s.entry_price ?? '',
      s.stop_loss ?? '',
      s.take_profit ?? '',
      s.timeframe ?? '15m',
      s.generated_at ?? '',
    ].join(',')
  );
  const csv = [header, ...rows].join('\n');
  const filename = `signals-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
