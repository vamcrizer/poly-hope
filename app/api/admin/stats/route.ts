import { NextRequest, NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  }

  if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = getAdminStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error('[admin/stats] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
