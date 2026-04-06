/**
 * Tests for lib/db.ts — SQLite CRUD helpers.
 *
 * DATABASE_URL is overridden to /tmp/test-polymarket.db via __tests__/setup-env.ts
 * which runs before any module import inside this Jest worker.
 *
 * After all tests we delete the temp file so there are no leftover artifacts.
 */

import fs from 'fs';
import {
  createUser,
  getUser,
  upsertSubscription,
  getSubscription,
  insertSignal,
  getLatestSignals,
} from '@/lib/db';

const TEMP_DB = '/tmp/test-polymarket.db';

afterAll(() => {
  // Clean up temp database files
  for (const f of [TEMP_DB, `${TEMP_DB}-wal`, `${TEMP_DB}-shm`]) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
});

// ─── Users ────────────────────────────────────────────────────────────────────

describe('db — createUser / getUser', () => {
  const email = `user-${Date.now()}@test.com`;
  const hash = '$2b$10$hashedpassword.example';

  it('createUser returns the newly created user', () => {
    const user = createUser(email, hash);

    expect(user).toBeDefined();
    expect(user.id).toBeGreaterThan(0);
    expect(user.email).toBe(email);
    expect(user.password_hash).toBe(hash);
    expect(typeof user.created_at).toBe('string');
  });

  it('getUser retrieves a user by email', () => {
    const found = getUser(email);

    expect(found).toBeDefined();
    expect(found!.email).toBe(email);
    expect(found!.password_hash).toBe(hash);
  });

  it('getUser returns undefined for a non-existent email', () => {
    const missing = getUser('nobody@nowhere.invalid');
    expect(missing).toBeUndefined();
  });

  it('createUser with duplicate email throws (UNIQUE constraint)', () => {
    expect(() => createUser(email, hash)).toThrow();
  });
});

// ─── Subscriptions ────────────────────────────────────────────────────────────

describe('db — upsertSubscription / getSubscription', () => {
  let userId: number;

  beforeAll(() => {
    const user = createUser(`sub-${Date.now()}@test.com`, 'hash');
    userId = user.id;
  });

  it('upsertSubscription creates a new subscription row', () => {
    upsertSubscription({
      userId,
      stripeCustomerId: 'cus_test123',
      stripeSubscriptionId: 'sub_test456',
      plan: 'pro',
      status: 'active',
      currentPeriodEnd: '2026-12-31T00:00:00.000Z',
    });

    const sub = getSubscription(userId);
    expect(sub).toBeDefined();
    expect(sub!.user_id).toBe(userId);
    expect(sub!.stripe_customer_id).toBe('cus_test123');
    expect(sub!.stripe_subscription_id).toBe('sub_test456');
    expect(sub!.plan).toBe('pro');
    expect(sub!.status).toBe('active');
  });

  it('getSubscription returns undefined for a user with no subscription', () => {
    const ghostUser = createUser(`ghost-${Date.now()}@test.com`, 'hash');
    const result = getSubscription(ghostUser.id);
    expect(result).toBeUndefined();
  });

  it('upsertSubscription updates an existing subscription', () => {
    upsertSubscription({ userId, status: 'cancelled' });

    const sub = getSubscription(userId);
    expect(sub!.status).toBe('cancelled');
    // Other fields should be preserved (COALESCE with NULL leaves them intact)
    expect(sub!.plan).toBe('pro');
  });

  it('upsertSubscription creates with defaults when only userId is provided', () => {
    const freshUser = createUser(`defaults-${Date.now()}@test.com`, 'hash');
    upsertSubscription({ userId: freshUser.id });

    const sub = getSubscription(freshUser.id);
    expect(sub).toBeDefined();
    expect(sub!.plan).toBe('basic');
    expect(sub!.status).toBe('inactive');
    expect(sub!.stripe_customer_id).toBeNull();
  });
});

// ─── Signals ──────────────────────────────────────────────────────────────────

describe('db — insertSignal / getLatestSignals', () => {
  it('insertSignal does not throw', () => {
    expect(() =>
      insertSignal({
        asset: 'BTC',
        direction: 'LONG',
        confidence: 0.78,
        entry_price: 83200,
        stop_loss: 81000,
        take_profit: 87500,
        timeframe: '15m',
      })
    ).not.toThrow();
  });

  it('getLatestSignals returns the inserted signal', () => {
    const signals = getLatestSignals();
    expect(Array.isArray(signals)).toBe(true);

    const btc = signals.find((s) => s.asset === 'BTC');
    expect(btc).toBeDefined();
    expect(btc!.direction).toBe('LONG');
    expect(btc!.confidence).toBeCloseTo(0.78);
    expect(btc!.entry_price).toBe(83200);
  });

  it('getLatestSignals returns only one row per asset (the latest)', () => {
    // Insert a second BTC signal — it should supersede the first
    insertSignal({
      asset: 'BTC',
      direction: 'SHORT',
      confidence: 0.55,
      entry_price: 84000,
    });

    const signals = getLatestSignals();
    const btcRows = signals.filter((s) => s.asset === 'BTC');
    // Should be exactly one BTC row (the most recent)
    expect(btcRows).toHaveLength(1);
  });

  it('insertSignal works without optional fields', () => {
    expect(() =>
      insertSignal({
        asset: 'ETH',
        direction: 'SHORT',
        confidence: 0.6,
      })
    ).not.toThrow();

    const signals = getLatestSignals();
    const eth = signals.find((s) => s.asset === 'ETH');
    expect(eth).toBeDefined();
    expect(eth!.entry_price).toBeNull();
    expect(eth!.stop_loss).toBeNull();
    expect(eth!.take_profit).toBeNull();
  });
});
