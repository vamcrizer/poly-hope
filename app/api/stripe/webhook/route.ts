import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { upsertSubscription } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    console.error('[stripe/webhook] Stripe keys not configured');
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  // Read raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('[stripe/webhook] Signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        await upsertSubscription({
          userId: Number(userId),
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          plan: resolvePlan(subscription),
          status: 'active',
          currentPeriodEnd: new Date(
            (subscription as unknown as { current_period_end: number }).current_period_end * 1000
          ).toISOString(),
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        const stripeStatus = subscription.status;
        const internalStatus =
          stripeStatus === 'active' || stripeStatus === 'trialing'
            ? 'active'
            : stripeStatus === 'canceled'
            ? 'cancelled'
            : stripeStatus === 'past_due' || stripeStatus === 'unpaid'
            ? 'past_due'
            : 'inactive';

        await upsertSubscription({
          userId: Number(userId),
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          plan: resolvePlan(subscription),
          status: internalStatus,
          currentPeriodEnd: new Date(
            (subscription as unknown as { current_period_end: number }).current_period_end * 1000
          ).toISOString(),
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        await upsertSubscription({
          userId: Number(userId),
          stripeSubscriptionId: subscription.id,
          status: 'cancelled',
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as unknown as { subscription: string }).subscription;
        if (!subscriptionId) break;

        // Retrieve subscription to get userId from metadata
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        await upsertSubscription({
          userId: Number(userId),
          status: 'past_due',
        });
        break;
      }

      default:
        // Unhandled event type — ignore
        break;
    }
  } catch (err) {
    console.error(`[stripe/webhook] Error processing event ${event.type}:`, err);
    // Return 200 to prevent Stripe retrying on our own processing errors
  }

  return NextResponse.json({ received: true });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Attempt to derive our plan name from the subscription's price metadata or
 * fall back to 'basic'.
 */
function resolvePlan(subscription: Stripe.Subscription): string {
  const priceId = subscription.items?.data?.[0]?.price?.id ?? '';

  if (priceId === process.env.STRIPE_PRICE_PRO) return 'pro';
  if (priceId === process.env.STRIPE_PRICE_API) return 'api';
  if (priceId === process.env.STRIPE_PRICE_BASIC) return 'basic';

  // Check metadata as a fallback
  return subscription.metadata?.plan ?? 'basic';
}
