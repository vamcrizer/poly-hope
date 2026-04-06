import { NextRequest, NextResponse } from 'next/server';
import { addNewsletterLead } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim() : '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  const source = typeof body.source === 'string' ? body.source.slice(0, 50) : 'landing';
  addNewsletterLead(email, source);

  return NextResponse.json({ success: true });
}
