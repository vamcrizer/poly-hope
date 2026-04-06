import { NextRequest, NextResponse } from 'next/server';
import { getNewsletterLeads } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  }
  if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const leads = getNewsletterLeads();
  return NextResponse.json({ leads, total: leads.length });
}
