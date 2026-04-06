/**
 * Tests for lib/signals.ts — mock signal data and formatting helpers.
 */

import { getMockSignals, formatConfidence } from '@/lib/signals';

describe('signals — getMockSignals', () => {
  it('returns exactly 5 signals', () => {
    const signals = getMockSignals();
    expect(signals).toHaveLength(5);
  });

  it('each signal has the required fields', () => {
    const signals = getMockSignals();
    for (const signal of signals) {
      expect(typeof signal.asset).toBe('string');
      expect(signal.asset.length).toBeGreaterThan(0);

      expect(['LONG', 'SHORT']).toContain(signal.direction);

      expect(typeof signal.confidence).toBe('number');
      expect(signal.confidence).toBeGreaterThan(0);
      expect(signal.confidence).toBeLessThanOrEqual(1);

      expect(typeof signal.entry_price).toBe('number');
      expect(signal.entry_price).toBeGreaterThan(0);
    }
  });

  it('all signals have valid direction (LONG or SHORT)', () => {
    const signals = getMockSignals();
    for (const signal of signals) {
      expect(['LONG', 'SHORT']).toContain(signal.direction);
    }
  });

  it('signals cover the expected set of assets', () => {
    const assets = getMockSignals().map((s) => s.asset).sort();
    expect(assets).toEqual(['BTC', 'DOGE', 'ETH', 'SOL', 'XRP']);
  });

  it('each call returns fresh timestamps', async () => {
    const before = new Date().getTime();
    await new Promise((r) => setTimeout(r, 5)); // tiny gap to ensure ordering
    const signals = getMockSignals();
    await new Promise((r) => setTimeout(r, 5));
    const after = new Date().getTime();

    for (const signal of signals) {
      const ts = new Date(signal.generated_at!).getTime();
      expect(ts).toBeGreaterThanOrEqual(before);
      expect(ts).toBeLessThanOrEqual(after);
    }
  });

  it('returns independent copies on each call (no shared reference)', () => {
    const first = getMockSignals();
    const second = getMockSignals();
    // Mutating the first array should not affect the second
    first[0].asset = 'MUTATED';
    expect(second[0].asset).not.toBe('MUTATED');
  });
});

describe('signals — formatConfidence', () => {
  it('converts 0.78 to "78%"', () => {
    expect(formatConfidence(0.78)).toBe('78%');
  });

  it('converts 0.65 to "65%"', () => {
    expect(formatConfidence(0.65)).toBe('65%');
  });

  it('converts 1.0 to "100%"', () => {
    expect(formatConfidence(1.0)).toBe('100%');
  });

  it('converts 0.0 to "0%"', () => {
    expect(formatConfidence(0.0)).toBe('0%');
  });

  it('rounds 0.786 to "79%"', () => {
    expect(formatConfidence(0.786)).toBe('79%');
  });
});
