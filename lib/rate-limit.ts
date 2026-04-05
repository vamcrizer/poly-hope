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
