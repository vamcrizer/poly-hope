import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUser, getSubscription } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUser(session.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const subscription = getSubscription(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      subscription: subscription
        ? {
            plan: subscription.plan,
            status: subscription.status,
            current_period_end: subscription.current_period_end,
          }
        : null,
    });
  } catch (err) {
    console.error('[user/me] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
