import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUser, upsertSubscription } from '@/lib/db';
import { signToken, setSessionCookie } from '@/lib/auth';
import { applyReferral } from '@/lib/db-extras';
import { sendWelcomeEmail } from '@/lib/email';
import { checkSignupRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown';
    const rl = checkSignupRateLimit(ip);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const refCode = searchParams.get('ref');

    const body = await request.json();
    const { email, password, utmSource, utmMedium, utmCampaign, refCode: bodyRefCode } = body as {
      email?: string;
      password?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      refCode?: string;
    };

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = getUser(email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = createUser(email.toLowerCase(), passwordHash);

    // Create inactive subscription record
    upsertSubscription({
      userId: user.id,
      plan: 'basic',
      status: 'inactive',
    });

    // Log UTM params for analytics (non-blocking)
    const effectiveRefCode = bodyRefCode?.trim() || refCode?.trim() || null;
    if (utmSource || utmMedium || utmCampaign) {
      console.info(`[signup] UTM — source:${utmSource ?? ''} medium:${utmMedium ?? ''} campaign:${utmCampaign ?? ''} user:${user.id}`);
    }

    // Apply referral if a valid ref code was provided
    if (effectiveRefCode && effectiveRefCode.length > 0) {
      try {
        applyReferral(effectiveRefCode, user.id);
      } catch (refErr) {
        // Non-fatal: log and continue
        console.warn('[signup] applyReferral error:', refErr);
      }
    }

    // Send welcome email (non-blocking, best-effort)
    sendWelcomeEmail(user.email).catch(() => {});

    // Sign JWT and set cookie
    const token = await signToken({ userId: user.id, email: user.email });
    const response = NextResponse.json(
      { success: true, user: { id: user.id, email: user.email } },
      { status: 201 }
    );
    setSessionCookie(response, token);

    return response;
  } catch (err) {
    console.error('[signup] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
