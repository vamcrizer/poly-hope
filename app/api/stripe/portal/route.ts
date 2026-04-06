import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSession } from '@/lib/auth';
import { getSubscription } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key, { apiVersion: '2025-04-30.basil' });
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sub = getSubscription(session.userId);
  if (!sub || !sub.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 400 });
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://polymarketsignals.com';

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${appUrl}/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error('[stripe/portal] Error creating portal session:', err);
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 });
  }
}
