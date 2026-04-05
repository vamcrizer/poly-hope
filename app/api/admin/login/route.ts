import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body as { password?: string };

    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
    }

    if (!password || password !== adminSecret) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const sessionHash = createHash('sha256').update(adminSecret).digest('hex');

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', sessionHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[admin/login] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
