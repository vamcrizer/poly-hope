import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getUser } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ── In-memory OTP store ────────────────────────────────────────────────────────
// key: email (lowercase), value: { otp, expires, requestCount, windowStart }
// Note: this resets on server restart. For multi-instance deployments, use Redis.

interface OtpEntry {
  otp: string;
  expires: number; // Unix ms
}

interface RateLimitEntry {
  count: number;
  windowStart: number; // Unix ms
}

const otpStore = new Map<string, OtpEntry>();
const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const OTP_TTL_MS = 15 * 60 * 1000; // 15 minutes

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateOtp(): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return String(digits);
}

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(email);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(email, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const transporter = createTransporter();

  const fromName = 'Polymarket Signals';
  const fromEmail = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? 'noreply@polymarketsignals.com';

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject: `Your password reset code: ${otp}`,
    text: [
      `Hi,`,
      ``,
      `Your password reset code for Polymarket Signals is:`,
      ``,
      `  ${otp}`,
      ``,
      `This code expires in 15 minutes.`,
      ``,
      `If you didn't request this, you can safely ignore this email.`,
      ``,
      `— Polymarket Signals`,
    ].join('\n'),
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0a0a0f;color:#e5e7eb;border-radius:12px;">
        <div style="margin-bottom:24px;">
          <span style="font-size:24px;">⚡</span>
          <span style="font-size:18px;font-weight:700;color:#fff;margin-left:8px;">Polymarket Signals</span>
        </div>
        <h2 style="color:#fff;font-size:20px;margin-bottom:8px;">Password reset code</h2>
        <p style="color:#9ca3af;font-size:14px;margin-bottom:24px;">
          Use the code below to reset your password. It expires in 15 minutes.
        </p>
        <div style="background:#111827;border:1px solid #374151;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
          <span style="font-family:monospace;font-size:36px;font-weight:700;letter-spacing:0.15em;color:#34d399;">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:12px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Rate limiting: 3 requests per hour per email
    if (isRateLimited(normalizedEmail)) {
      // Return same success response to avoid leaking info, but add a header hint
      return NextResponse.json(
        { success: true, message: 'If this email exists, a reset code has been sent' },
        { status: 200, headers: { 'X-RateLimit-Exceeded': '1' } }
      );
    }

    // Check if user exists
    const user = getUser(normalizedEmail);

    // Always respond the same way regardless of whether user exists (security)
    const GENERIC_RESPONSE = NextResponse.json({
      success: true,
      message: 'If this email exists, a reset code has been sent',
    });

    if (!user) {
      return GENERIC_RESPONSE;
    }

    // Generate OTP and store it
    const otp = generateOtp();
    otpStore.set(normalizedEmail, {
      otp,
      expires: Date.now() + OTP_TTL_MS,
    });

    // Send email (fire and don't await in background to respond quickly)
    // We still await here so errors can be logged, but we always return success
    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (mailErr) {
      console.error('[forgot-password] email send failed:', mailErr);
      // Don't expose mail errors to the client
    }

    return GENERIC_RESPONSE;
  } catch (err) {
    console.error('[forgot-password] error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ── Export OTP store for use by the reset-password route ─────────────────────
// (Same module so the Map is shared within the same Node.js process)

export { otpStore };
