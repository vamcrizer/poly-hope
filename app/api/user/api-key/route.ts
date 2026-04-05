import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUser, getSubscription, getApiKey, createApiKey } from '@/lib/db';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

async function requireApiTier(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return { error: 'Unauthorized', status: 401 };

  const user = getUser(session.email);
  if (!user) return { error: 'User not found', status: 404 };

  const subscription = getSubscription(user.id);
  if (!subscription || subscription.status !== 'active' || subscription.plan !== 'api') {
    return {
      error: 'API tier required',
      message: 'An active API tier subscription is required to use the API key feature.',
      upgradeUrl: '/pricing',
      status: 403,
    };
  }

  return { user, subscription };
}

// GET — return current API key (generate if none exists)
export async function GET(request: NextRequest) {
  try {
    const result = await requireApiTier(request);
    if ('error' in result && !('user' in result)) {
      return NextResponse.json(
        { error: result.error, message: result.message, upgradeUrl: result.upgradeUrl },
        { status: result.status }
      );
    }

    const { user } = result as { user: { id: number; email: string } };
    const userId: number = user.id;

    let existingKey = getApiKey(userId);
    let plainKey: string | null = null;

    if (!existingKey) {
      // Generate new key and return it once — we can show it to the user
      plainKey = createApiKey(userId);
      existingKey = getApiKey(userId)!;
    }

    // Mask the key — only show full key on first generation
    const maskedKey = plainKey
      ? plainKey
      : `sk_live_${'*'.repeat(24)}`;

    return NextResponse.json({
      key: maskedKey,
      is_new: !!plainKey,
      created_at: existingKey.created_at,
    });
  } catch (err) {
    console.error('[user/api-key GET] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — regenerate API key
export async function POST(request: NextRequest) {
  try {
    const result = await requireApiTier(request);
    if ('error' in result && !('user' in result)) {
      return NextResponse.json(
        { error: result.error, message: result.message, upgradeUrl: result.upgradeUrl },
        { status: result.status }
      );
    }

    const userId: number = (result as { user: { id: number } }).user.id;

    const plainKey = createApiKey(userId);
    const newRecord = getApiKey(userId)!;

    return NextResponse.json({
      key: plainKey,
      is_new: true,
      created_at: newRecord.created_at,
    });
  } catch (err) {
    console.error('[user/api-key POST] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
