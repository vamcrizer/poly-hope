import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUser } from '@/lib/db';
import { signToken, setSessionCookie } from '@/lib/auth';
import { checkLoginRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown';
    const rl = checkLoginRateLimit(ip);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait 15 minutes.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Look up user
    const user = getUser(email.toLowerCase());
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Sign JWT and set cookie
    const token = await signToken({ userId: user.id, email: user.email });
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
    });
    setSessionCookie(response, token);

    return response;
  } catch (err) {
    console.error('[login] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
