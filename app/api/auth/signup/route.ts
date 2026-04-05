import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUser, upsertSubscription } from '@/lib/db';
import { signToken, setSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

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
