import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSubscription, getSignalsHistory } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sub = getSubscription(session.userId);
  if (!sub || sub.status !== 'active') {
    return NextResponse.json({ error: 'Active subscription required' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const asset = searchParams.get('asset') ?? 'ALL';
  const direction = searchParams.get('direction') ?? 'ALL';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = 25;
  const offset = (page - 1) * limit;

  const { signals, total } = getSignalsHistory({ asset, direction, limit, offset });

  return NextResponse.json({
    signals,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}
