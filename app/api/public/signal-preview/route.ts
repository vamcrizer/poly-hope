import { NextResponse } from 'next/server';
import { getLatestSignals } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const signals = getLatestSignals();

    const preview = signals.map((s) => ({
      asset: s.asset,
      direction: s.direction,
      timeframe: s.timeframe ?? '15m',
      timestamp: s.generated_at,
    }));

    return NextResponse.json(preview, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('[signal-preview] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
