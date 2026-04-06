/**
 * Tests for lib/rate-limit.ts — in-memory sliding-window rate limiter.
 *
 * The module keeps a singleton Map. To avoid cross-test contamination we use
 * unique API key strings per test / describe block.
 */

import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

// ─── Basic allow / block behaviour ───────────────────────────────────────────

describe('rate-limit — checkRateLimit', () => {
  it('first request is allowed and remaining is 999', () => {
    const result = checkRateLimit('key-first-request');

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(999);
    expect(result.limit).toBe(1000);
  });

  it('second request in the same window is still allowed', () => {
    const key = 'key-second-request';
    checkRateLimit(key); // 1st
    const result = checkRateLimit(key); // 2nd

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(998);
  });

  it('1000th request is allowed (boundary)', () => {
    const key = 'key-boundary-1000';
    // Make 999 requests first
    for (let i = 0; i < 999; i++) checkRateLimit(key);
    const result = checkRateLimit(key); // 1000th

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('1001st request is blocked after 1000 have been made', () => {
    const key = 'key-over-limit';
    // Exhaust the allowance
    for (let i = 0; i < 1000; i++) checkRateLimit(key);
    const result = checkRateLimit(key); // 1001st

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.limit).toBe(1000);
  });

  it('different API keys have independent limits', () => {
    const keyA = 'key-independent-A';
    const keyB = 'key-independent-B';

    // Exhaust keyA
    for (let i = 0; i < 1000; i++) checkRateLimit(keyA);
    const blockedA = checkRateLimit(keyA);
    expect(blockedA.allowed).toBe(false);

    // keyB is unaffected — first request should be allowed
    const resultB = checkRateLimit(keyB);
    expect(resultB.allowed).toBe(true);
    expect(resultB.remaining).toBe(999);
  });

  it('resetAt is roughly 24 hours from now', () => {
    const before = Date.now();
    const result = checkRateLimit('key-reset-time');
    const after = Date.now();

    const expectedMin = before + 24 * 60 * 60 * 1000;
    const expectedMax = after + 24 * 60 * 60 * 1000;

    expect(result.resetAt).toBeGreaterThanOrEqual(expectedMin);
    expect(result.resetAt).toBeLessThanOrEqual(expectedMax);
  });
});

// ─── Header generation ────────────────────────────────────────────────────────

describe('rate-limit — getRateLimitHeaders', () => {
  it('returns the correct header keys and string values', () => {
    const key = 'key-headers-test';
    const result = checkRateLimit(key);
    const headers = getRateLimitHeaders(result);

    expect(headers).toHaveProperty('X-RateLimit-Limit');
    expect(headers).toHaveProperty('X-RateLimit-Remaining');
    expect(headers).toHaveProperty('X-RateLimit-Reset');

    // All values must be strings (HTTP headers are strings)
    expect(typeof headers['X-RateLimit-Limit']).toBe('string');
    expect(typeof headers['X-RateLimit-Remaining']).toBe('string');
    expect(typeof headers['X-RateLimit-Reset']).toBe('string');
  });

  it('X-RateLimit-Limit header reflects the 1000 limit', () => {
    const result = checkRateLimit('key-headers-limit');
    const headers = getRateLimitHeaders(result);

    expect(headers['X-RateLimit-Limit']).toBe('1000');
  });

  it('X-RateLimit-Remaining decrements with each request', () => {
    const key = 'key-headers-remaining';
    const r1 = getRateLimitHeaders(checkRateLimit(key));
    const r2 = getRateLimitHeaders(checkRateLimit(key));

    expect(Number(r1['X-RateLimit-Remaining'])).toBe(999);
    expect(Number(r2['X-RateLimit-Remaining'])).toBe(998);
  });

  it('X-RateLimit-Reset is a Unix timestamp in seconds (not ms)', () => {
    const result = checkRateLimit('key-reset-header');
    const headers = getRateLimitHeaders(result);
    const resetSeconds = Number(headers['X-RateLimit-Reset']);

    // Unix timestamp in seconds for 2026 is roughly in the range 1.7e9 – 1.9e9
    expect(resetSeconds).toBeGreaterThan(1_700_000_000);
    expect(resetSeconds).toBeLessThan(2_000_000_000);
    // Must be ceil(resetAt / 1000)
    expect(resetSeconds).toBe(Math.ceil(result.resetAt / 1000));
  });

  it('remaining header is 0 when the key is blocked', () => {
    const key = 'key-headers-blocked';
    for (let i = 0; i < 1000; i++) checkRateLimit(key);
    const result = checkRateLimit(key); // blocked
    const headers = getRateLimitHeaders(result);

    expect(headers['X-RateLimit-Remaining']).toBe('0');
  });
});
