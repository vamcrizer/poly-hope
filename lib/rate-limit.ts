/**
 * Simple in-memory rate limiter for API tier.
 * Uses a sliding window approach.
 * In production with multiple instances, use Redis instead.
 */

type RateLimitEntry = {
  count: number;
  windowStart: number;
};

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_REQUESTS_PER_WINDOW = 1000;

// In-memory store: apiKey → { count, windowStart }
const store = new Map<string, RateLimitEntry>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number; // Unix timestamp ms
};

export function checkRateLimit(apiKey: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(apiKey);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // New window
    store.set(apiKey, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      limit: MAX_REQUESTS_PER_WINDOW,
      resetAt: now + WINDOW_MS,
    };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      limit: MAX_REQUESTS_PER_WINDOW,
      resetAt: entry.windowStart + WINDOW_MS,
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - entry.count,
    limit: MAX_REQUESTS_PER_WINDOW,
    resetAt: entry.windowStart + WINDOW_MS,
  };
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  };
}

// ── Signup rate limiter (per IP, 5 signups per hour) ─────────────────────────

const SIGNUP_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const SIGNUP_MAX = 5;
const signupStore = new Map<string, RateLimitEntry>();

// ── Login rate limiter (per IP, 10 attempts per 15 min) ──────────────────────

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOGIN_MAX = 10;
const loginStore = new Map<string, RateLimitEntry>();

export function checkLoginRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = loginStore.get(ip);

  if (!entry || now - entry.windowStart > LOGIN_WINDOW_MS) {
    loginStore.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: LOGIN_MAX - 1, limit: LOGIN_MAX, resetAt: now + LOGIN_WINDOW_MS };
  }

  if (entry.count >= LOGIN_MAX) {
    return { allowed: false, remaining: 0, limit: LOGIN_MAX, resetAt: entry.windowStart + LOGIN_WINDOW_MS };
  }

  entry.count += 1;
  return { allowed: true, remaining: LOGIN_MAX - entry.count, limit: LOGIN_MAX, resetAt: entry.windowStart + LOGIN_WINDOW_MS };
}

export function checkSignupRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = signupStore.get(ip);

  if (!entry || now - entry.windowStart > SIGNUP_WINDOW_MS) {
    signupStore.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: SIGNUP_MAX - 1, limit: SIGNUP_MAX, resetAt: now + SIGNUP_WINDOW_MS };
  }

  if (entry.count >= SIGNUP_MAX) {
    return { allowed: false, remaining: 0, limit: SIGNUP_MAX, resetAt: entry.windowStart + SIGNUP_WINDOW_MS };
  }

  entry.count += 1;
  return { allowed: true, remaining: SIGNUP_MAX - entry.count, limit: SIGNUP_MAX, resetAt: entry.windowStart + SIGNUP_WINDOW_MS };
}
