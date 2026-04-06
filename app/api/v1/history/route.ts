import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getUserByApiKey, getSignalsHistory } from '@/lib/db';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Provide your API key via: Authorization: Bearer YOUR_API_KEY' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.slice(7);
    const keyHash = createHash('sha256').update(apiKey).digest('hex');
    const user = getUserByApiKey(keyHash);

    if (!user) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    if (user.plan !== 'api') {
      return NextResponse.json(
        { error: 'API plan required', message: 'Upgrade to API plan at /pricing' },
        { status: 403 }
      );
    }

    if (user.status !== 'active') {
      return NextResponse.json({ error: 'Subscription inactive' }, { status: 403 });
    }

    // Rate limit
    const rl = checkRateLimit(apiKey);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: getRateLimitHeaders(rl) }
      );
    }

    const { searchParams } = new URL(request.url);
    const asset = searchParams.get('asset') ?? 'ALL';
    const direction = searchParams.get('direction') ?? 'ALL';
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)));
    const offset = (page - 1) * limit;

    const { signals, total } = getSignalsHistory({ asset, direction, limit, offset });

    return NextResponse.json(
      {
        signals,
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      { headers: getRateLimitHeaders(rl) }
    );
  } catch (err) {
    console.error('[v1/history] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
