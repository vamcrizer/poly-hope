import { NextRequest, NextResponse } from 'next/server';
import { insertSignal } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface IncomingSignal {
  asset: string;
  direction: 'LONG' | 'SHORT';
  confidence: number;
  entry_price?: number;
  stop_loss?: number;
  take_profit?: number;
  timeframe?: string;
}

function validateSignal(s: unknown): s is IncomingSignal {
  if (typeof s !== 'object' || s === null) return false;
  const obj = s as Record<string, unknown>;
  if (typeof obj.asset !== 'string' || !obj.asset) return false;
  if (obj.direction !== 'LONG' && obj.direction !== 'SHORT') return false;
  if (typeof obj.confidence !== 'number' || obj.confidence < 0 || obj.confidence > 1) return false;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    const authHeader = request.headers.get('authorization');
    const providedSecret = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!adminSecret || providedSecret !== adminSecret) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Request body must be an array of signal objects' },
        { status: 400 }
      );
    }

    const invalid: number[] = [];
    const valid: IncomingSignal[] = [];

    body.forEach((item: unknown, index: number) => {
      if (validateSignal(item)) {
        valid.push(item);
      } else {
        invalid.push(index);
      }
    });

    if (invalid.length > 0) {
      return NextResponse.json(
        {
          error: 'Some signals failed validation',
          invalid_indices: invalid,
          message: 'Each signal requires: asset (string), direction (LONG|SHORT), confidence (0-1)',
        },
        { status: 400 }
      );
    }

    let inserted = 0;
    for (const signal of valid) {
      insertSignal({
        asset: signal.asset.toUpperCase(),
        direction: signal.direction,
        confidence: signal.confidence,
        entry_price: signal.entry_price,
        stop_loss: signal.stop_loss,
        take_profit: signal.take_profit,
        timeframe: signal.timeframe,
      });
      inserted++;
    }

    return NextResponse.json({ inserted });
  } catch (err) {
    console.error('[admin/signals] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
