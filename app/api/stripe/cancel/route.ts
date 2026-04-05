import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSession } from '@/lib/auth';
import { getSubscription, upsertSubscription } from '@/lib/db';

export const dynamic = 'force-dynamic';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key, { apiVersion: '2025-04-30.basil' });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sub = getSubscription(session.userId);
    if (!sub || sub.status !== 'active' || !sub.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription to cancel' },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    // Cancel at period end (not immediately — better UX)
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Update local DB status to reflect pending cancellation
    upsertSubscription({
      userId: session.userId,
      status: 'cancelled',
    });

    return NextResponse.json({ success: true, message: 'Subscription will cancel at end of billing period' });
  } catch (error) {
    console.error('Stripe cancel error:', error);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
