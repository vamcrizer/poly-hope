import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getUserByApiKey, getLatestSignals } from '@/lib/db';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message:
            'Provide your API key via the Authorization header: Authorization: Bearer YOUR_API_KEY',
        },
        { status: 401 }
      );
    }

    const apiKey = authHeader.slice(7);
    const keyHash = createHash('sha256').update(apiKey).digest('hex');

    const user = getUserByApiKey(keyHash);

    if (!user) {
      return NextResponse.json(
        {
          error: 'Invalid API key',
          message:
            'The provided API key was not found. Generate one from your dashboard at /dashboard/api-key',
        },
        { status: 401 }
      );
    }

    if (user.plan !== 'api') {
      return NextResponse.json(
        {
          error: 'Insufficient plan',
          message:
            'API access requires the API tier subscription ($99/mo). Upgrade at /pricing',
          upgradeUrl: '/pricing',
        },
        { status: 403 }
      );
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        {
          error: 'Subscription inactive',
          message: 'Your API subscription is not active. Please check your billing.',
        },
        { status: 403 }
      );
    }

    // Check rate limit
    const rateLimitResult = checkRateLimit(apiKey);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'You have exceeded 1,000 requests/day. Resets at midnight UTC.' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const signals = getLatestSignals();

    const response = NextResponse.json({
      signals,
      generated_at: signals[0]?.generated_at ?? new Date().toISOString(),
      count: signals.length,
    });

    // Add rate limit headers to successful response
    const rlHeaders = getRateLimitHeaders(rateLimitResult);
    Object.entries(rlHeaders).forEach(([k, v]) => response.headers.set(k, v));

    return response;
  } catch (err) {
    console.error('[v1/signals] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
