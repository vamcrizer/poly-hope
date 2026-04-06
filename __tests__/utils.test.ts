/**
 * Tests for lib/utils.ts — formatting and business-logic helpers.
 *
 * We only test functions that exist in the file. Read the source before
 * adding any new test case.
 */

import {
  formatPrice,
  formatConfidence,
  calcRiskReward,
  isSubscriptionActive,
  getConfidenceColor,
  getDirectionColor,
  getDirectionBg,
  timeAgo,
} from '@/lib/utils';
import type { Signal } from '@/types';

// ─── formatPrice ──────────────────────────────────────────────────────────────

describe('utils — formatPrice', () => {
  it('formats large integers with commas (>= 1000)', () => {
    expect(formatPrice(83200)).toBe('$83,200');
  });

  it('formats values >= 1000 with up to 2 decimal places', () => {
    expect(formatPrice(1820.5)).toBe('$1,820.5');
  });

  it('formats values >= 1 and < 1000 with 4 decimal places', () => {
    // entry_price for XRP is 2.21
    expect(formatPrice(2.21)).toBe('$2.2100');
  });

  it('formats values < 1 with 6 decimal places', () => {
    // entry_price for DOGE is 0.168
    expect(formatPrice(0.168)).toBe('$0.168000');
  });

  it('formats 1.0 exactly (boundary between <1 and >=1 cases)', () => {
    expect(formatPrice(1)).toBe('$1.0000');
  });

  it('formats exactly 1000 with commas (boundary)', () => {
    expect(formatPrice(1000)).toBe('$1,000');
  });
});

// ─── formatConfidence ────────────────────────────────────────────────────────

describe('utils — formatConfidence', () => {
  it('converts 0.78 to "78%"', () => {
    expect(formatConfidence(0.78)).toBe('78%');
  });

  it('converts 0.0 to "0%"', () => {
    expect(formatConfidence(0.0)).toBe('0%');
  });

  it('converts 1.0 to "100%"', () => {
    expect(formatConfidence(1.0)).toBe('100%');
  });

  it('rounds correctly — 0.785 rounds to "79%"', () => {
    expect(formatConfidence(0.785)).toBe('79%');
  });

  it('rounds correctly — 0.784 rounds to "78%"', () => {
    expect(formatConfidence(0.784)).toBe('78%');
  });
});

// ─── calcRiskReward ───────────────────────────────────────────────────────────

/**
 * calcRiskReward takes a full Signal object.
 * Helper to build a minimal valid Signal for testing.
 */
function makeSignal(entry: number, stop: number, target: number): Signal {
  return {
    asset: 'BTC',
    direction: 'LONG',
    confidence: 0.7,
    entry_price: entry,
    stop_loss: stop,
    take_profit: target,
    timeframe: '15m',
    generated_at: new Date().toISOString(),
  };
}

describe('utils — calcRiskReward', () => {
  it('returns "2.0R" for a 2-to-1 reward/risk ratio', () => {
    // risk = |100 - 90| = 10, reward = |120 - 100| = 20  →  20/10 = 2.0
    expect(calcRiskReward(makeSignal(100, 90, 120))).toBe('2.0R');
  });

  it('returns "1.0R" for a 1-to-1 ratio', () => {
    expect(calcRiskReward(makeSignal(100, 90, 110))).toBe('1.0R');
  });

  it('returns "N/A" when risk is zero (entry == stop)', () => {
    expect(calcRiskReward(makeSignal(100, 100, 120))).toBe('N/A');
  });

  it('calculates correctly for SHORT signals', () => {
    // SOL SHORT: entry=132, stop=138, take_profit=118
    // risk = |132 - 138| = 6, reward = |118 - 132| = 14  →  14/6 ≈ 2.3
    const result = calcRiskReward(makeSignal(132, 138, 118));
    expect(result).toBe('2.3R');
  });

  it('formats to 1 decimal place', () => {
    // risk = 3, reward = 10  →  10/3 ≈ 3.3
    const result = calcRiskReward(makeSignal(100, 97, 110));
    expect(result).toBe('3.3R');
  });
});

// ─── isSubscriptionActive ────────────────────────────────────────────────────

describe('utils — isSubscriptionActive', () => {
  it('returns true for "active"', () => {
    expect(isSubscriptionActive('active')).toBe(true);
  });

  it('returns false for "cancelled"', () => {
    expect(isSubscriptionActive('cancelled')).toBe(false);
  });

  it('returns false for "inactive"', () => {
    expect(isSubscriptionActive('inactive')).toBe(false);
  });

  it('returns false for "past_due"', () => {
    expect(isSubscriptionActive('past_due')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isSubscriptionActive(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isSubscriptionActive(undefined)).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isSubscriptionActive('')).toBe(false);
  });
});

// ─── getConfidenceColor ───────────────────────────────────────────────────────

describe('utils — getConfidenceColor', () => {
  it('returns emerald for confidence >= 0.75', () => {
    expect(getConfidenceColor(0.75)).toBe('text-emerald-400');
    expect(getConfidenceColor(1.0)).toBe('text-emerald-400');
  });

  it('returns yellow for confidence >= 0.65 and < 0.75', () => {
    expect(getConfidenceColor(0.65)).toBe('text-yellow-400');
    expect(getConfidenceColor(0.74)).toBe('text-yellow-400');
  });

  it('returns orange for confidence < 0.65', () => {
    expect(getConfidenceColor(0.64)).toBe('text-orange-400');
    expect(getConfidenceColor(0.0)).toBe('text-orange-400');
  });
});

// ─── getDirectionColor ────────────────────────────────────────────────────────

describe('utils — getDirectionColor', () => {
  it('returns emerald for LONG', () => {
    expect(getDirectionColor('LONG')).toBe('text-emerald-400');
  });

  it('returns red for SHORT', () => {
    expect(getDirectionColor('SHORT')).toBe('text-red-400');
  });
});

// ─── getDirectionBg ───────────────────────────────────────────────────────────

describe('utils — getDirectionBg', () => {
  it('returns emerald background class for LONG', () => {
    const cls = getDirectionBg('LONG');
    expect(cls).toContain('emerald');
  });

  it('returns red background class for SHORT', () => {
    const cls = getDirectionBg('SHORT');
    expect(cls).toContain('red');
  });
});

// ─── timeAgo ─────────────────────────────────────────────────────────────────

describe('utils — timeAgo', () => {
  function isoSecondsAgo(s: number): string {
    return new Date(Date.now() - s * 1000).toISOString();
  }

  it('returns "just now" for timestamps less than 1 minute ago', () => {
    expect(timeAgo(isoSecondsAgo(30))).toBe('just now');
  });

  it('returns minutes ago for timestamps < 60 minutes ago', () => {
    expect(timeAgo(isoSecondsAgo(5 * 60))).toBe('5m ago');
  });

  it('returns hours ago for timestamps >= 60 minutes and < 24 hours ago', () => {
    expect(timeAgo(isoSecondsAgo(3 * 60 * 60))).toBe('3h ago');
  });

  it('returns a date string for timestamps >= 24 hours ago', () => {
    const result = timeAgo(isoSecondsAgo(25 * 60 * 60));
    // Should be a short date like "Apr 5" — not an "ago" string
    expect(result).not.toContain('ago');
    expect(result.length).toBeGreaterThan(0);
  });
});
