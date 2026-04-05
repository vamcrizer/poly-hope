import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSubscription, getLatestSignals } from '@/lib/db';
import { readSignalsFromFile, getMockSignals } from '@/lib/signals';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = getSubscription(session.userId);
    if (!subscription || subscription.status !== 'active') {
      return NextResponse.json(
        {
          error: 'subscription_required',
          message: 'An active subscription is required to view signals.',
          upgradeUrl: '/pricing',
        },
        { status: 403 }
      );
    }

    // Try DB first (latest signals within last 24h)
    const dbSignals = getLatestSignals();
    if (dbSignals.length > 0) {
      return NextResponse.json({
        signals: dbSignals,
        generated_at: dbSignals[0]?.generated_at ?? new Date().toISOString(),
        source: 'db',
      });
    }

    // Fallback: read from public/signals.json
    const fileSignals = readSignalsFromFile();
    if (fileSignals.length > 0) {
      return NextResponse.json({
        signals: fileSignals,
        generated_at: fileSignals[0]?.generated_at ?? new Date().toISOString(),
        source: 'file',
      });
    }

    // Final fallback: hardcoded mock/demo data
    const mockSignals = getMockSignals();
    return NextResponse.json({
      signals: mockSignals,
      generated_at: new Date().toISOString(),
      source: 'demo',
    });
  } catch (err) {
    console.error('[signals] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
