import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSignalOutcomes, getPerformanceStats, seedDemoOutcomes } from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  seedDemoOutcomes();
  const outcomes = getSignalOutcomes(50);
  const stats = getPerformanceStats();

  return NextResponse.json({ outcomes, stats });
}
