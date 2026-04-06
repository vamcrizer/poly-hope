import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createReferralCode, getReferralStats } from '@/lib/db-extras';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://polymarketsignals.com';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Generate a code if the user doesn't have one yet
  const code = createReferralCode(session.userId);
  const stats = getReferralStats(session.userId);

  return NextResponse.json({
    success: true,
    code,
    link: `${BASE_URL}/signup?ref=${code}`,
    referrals_count: stats.referrals_count,
    pending_count: stats.pending_count,
  });
}
