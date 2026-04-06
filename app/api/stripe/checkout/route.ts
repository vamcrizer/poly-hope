import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

type Plan = 'basic' | 'pro' | 'api';

const PRICE_MAP: Record<Plan, string | undefined> = {
  basic: process.env.STRIPE_PRICE_BASIC,
  pro: process.env.STRIPE_PRICE_PRO,
  api: process.env.STRIPE_PRICE_API,
};

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { plan, promoCode } = body as { plan?: Plan; promoCode?: string };

    if (!plan || !['basic', 'pro', 'api'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be one of: basic, pro, api' },
        { status: 400 }
      );
    }

    const priceId = PRICE_MAP[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID for plan "${plan}" is not configured` },
        { status: 500 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Build checkout params
    const checkoutParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: session.email,
      success_url: `${appUrl}/dashboard?success=1`,
      cancel_url: `${appUrl}/pricing`,
      metadata: { userId: String(session.userId) },
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId: String(session.userId) },
      },
      // Allow promo codes entered at checkout
      allow_promotion_codes: !promoCode,
    };

    // If a specific promo code was passed, look it up and apply it
    if (promoCode) {
      const codes = await stripe.promotionCodes.list({ code: promoCode, active: true, limit: 1 });
      if (codes.data.length > 0) {
        checkoutParams.discounts = [{ promotion_code: codes.data[0].id }];
      } else {
        // Code not found — fall back to allowing any promo code at checkout
        checkoutParams.allow_promotion_codes = true;
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutParams);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error('[stripe/checkout] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
