import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { sendSignalsEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const ok = await sendSignalsEmail(session.email, [
      {
        asset: 'BTC',
        direction: 'LONG',
        confidence: 0.78,
        entry_price: 83200,
        stop_loss: 81000,
        take_profit: 87500,
        timeframe: '15m',
        generated_at: new Date().toISOString(),
      } as any,
    ]);

    return NextResponse.json({ success: ok });
  } catch (err) {
    console.error('[email/test] error:', err);
    return NextResponse.json({ error: 'Email sending failed — check SMTP configuration' }, { status: 500 });
  }
}
