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

  const format = new URL(request.url).searchParams.get('format');
  if (format === 'csv') {
    const header = 'email,source,created_at';
    const rows = leads.map((l) => `${l.email},${l.source},${l.created_at}`);
    const csv = [header, ...rows].join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="newsletter-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ leads, total: leads.length });
}
