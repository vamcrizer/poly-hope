import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DATABASE_URL || './polymarket-signals.db';

// Resolve relative path from CWD
const resolvedPath = path.isAbsolute(DB_PATH)
  ? DB_PATH
  : path.resolve(process.cwd(), DB_PATH);

const db = new Database(resolvedPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables on init
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan TEXT DEFAULT 'basic',
    status TEXT DEFAULT 'inactive',
    current_period_end TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS signals_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset TEXT NOT NULL,
    direction TEXT NOT NULL,
    confidence REAL NOT NULL,
    entry_price REAL,
    stop_loss REAL,
    take_profit REAL,
    timeframe TEXT,
    generated_at TEXT DEFAULT (datetime('now'))
  );
`);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: 'basic' | 'pro' | 'api';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  current_period_end: string | null;
  created_at: string;
}

export interface Signal {
  id: number;
  asset: string;
  direction: 'LONG' | 'SHORT';
  confidence: number;
  entry_price: number | null;
  stop_loss: number | null;
  take_profit: number | null;
  timeframe: string | null;
  generated_at: string;
}

// ─── User helpers ─────────────────────────────────────────────────────────────

export function getUser(email: string): User | undefined {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
}

export function createUser(email: string, passwordHash: string): User {
  const stmt = db.prepare(
    'INSERT INTO users (email, password_hash) VALUES (?, ?) RETURNING *'
  );
  return stmt.get(email, passwordHash) as User;
}

// ─── Subscription helpers ─────────────────────────────────────────────────────

export function getSubscription(userId: number): Subscription | undefined {
  return db
    .prepare('SELECT * FROM subscriptions WHERE user_id = ?')
    .get(userId) as Subscription | undefined;
}

export function upsertSubscription(params: {
  userId: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  plan?: string;
  status?: string;
  currentPeriodEnd?: string;
}): void {
  const existing = getSubscription(params.userId);

  if (existing) {
    db.prepare(`
      UPDATE subscriptions SET
        stripe_customer_id   = COALESCE(?, stripe_customer_id),
        stripe_subscription_id = COALESCE(?, stripe_subscription_id),
        plan                 = COALESCE(?, plan),
        status               = COALESCE(?, status),
        current_period_end   = COALESCE(?, current_period_end)
      WHERE user_id = ?
    `).run(
      params.stripeCustomerId ?? null,
      params.stripeSubscriptionId ?? null,
      params.plan ?? null,
      params.status ?? null,
      params.currentPeriodEnd ?? null,
      params.userId
    );
  } else {
    db.prepare(`
      INSERT INTO subscriptions
        (user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      params.userId,
      params.stripeCustomerId ?? null,
      params.stripeSubscriptionId ?? null,
      params.plan ?? 'basic',
      params.status ?? 'inactive',
      params.currentPeriodEnd ?? null
    );
  }
}

// ─── Signals helpers ──────────────────────────────────────────────────────────

/**
 * Returns the latest signal per asset generated within the last 24 hours.
 */
export function getLatestSignals(): Signal[] {
  return db.prepare(`
    SELECT s.*
    FROM signals_cache s
    INNER JOIN (
      SELECT asset, MAX(generated_at) AS max_generated_at
      FROM signals_cache
      WHERE generated_at >= datetime('now', '-24 hours')
      GROUP BY asset
    ) latest ON s.asset = latest.asset AND s.generated_at = latest.max_generated_at
    ORDER BY s.asset ASC
  `).all() as Signal[];
}

export function insertSignal(signal: {
  asset: string;
  direction: string;
  confidence: number;
  entry_price?: number;
  stop_loss?: number;
  take_profit?: number;
  timeframe?: string;
}): void {
  db.prepare(`
    INSERT INTO signals_cache
      (asset, direction, confidence, entry_price, stop_loss, take_profit, timeframe)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    signal.asset,
    signal.direction,
    signal.confidence,
    signal.entry_price ?? null,
    signal.stop_loss ?? null,
    signal.take_profit ?? null,
    signal.timeframe ?? null
  );
}

// ─── Signal Outcomes ──────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS signal_outcomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    signal_id INTEGER,
    asset TEXT NOT NULL,
    direction TEXT NOT NULL,
    entry_price REAL,
    stop_loss REAL,
    take_profit REAL,
    exit_price REAL,
    outcome TEXT CHECK(outcome IN ('win', 'loss', 'open', 'expired')),
    pnl_pct REAL,
    generated_at TEXT,
    closed_at TEXT
  );
`);

export function getSignalOutcomes(limit = 50): any[] {
  return db.prepare(`
    SELECT * FROM signal_outcomes ORDER BY generated_at DESC LIMIT ?
  `).all(limit) as any[];
}

export function getPerformanceStats(): {
  total: number; wins: number; losses: number; win_rate: number; avg_pnl: number
} {
  const row = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN outcome='win' THEN 1 ELSE 0 END) as wins,
      SUM(CASE WHEN outcome='loss' THEN 1 ELSE 0 END) as losses,
      AVG(CASE WHEN pnl_pct IS NOT NULL THEN pnl_pct ELSE 0 END) as avg_pnl
    FROM signal_outcomes
    WHERE outcome IN ('win', 'loss')
  `).get() as any;
  const wins = row.wins ?? 0;
  const losses = row.losses ?? 0;
  const total = wins + losses;
  return {
    total,
    wins,
    losses,
    win_rate: total > 0 ? wins / total : 0,
    avg_pnl: row.avg_pnl ?? 0,
  };
}

export function seedDemoOutcomes(): void {
  const count = (db.prepare('SELECT COUNT(*) as n FROM signal_outcomes').get() as any).n;
  if (count > 0) return; // already seeded

  const demos = [
    { asset: 'BTC', direction: 'LONG', entry_price: 82100, stop_loss: 80000, take_profit: 86500, exit_price: 86100, outcome: 'win', pnl_pct: 4.87 },
    { asset: 'ETH', direction: 'SHORT', entry_price: 1920, stop_loss: 1980, take_profit: 1800, exit_price: 1805, outcome: 'win', pnl_pct: 5.99 },
    { asset: 'SOL', direction: 'LONG', entry_price: 128, stop_loss: 122, take_profit: 140, exit_price: 122.5, outcome: 'loss', pnl_pct: -4.30 },
    { asset: 'BTC', direction: 'SHORT', entry_price: 85200, stop_loss: 87500, take_profit: 80000, exit_price: 80500, outcome: 'win', pnl_pct: 5.52 },
    { asset: 'XRP', direction: 'LONG', entry_price: 2.15, stop_loss: 2.04, take_profit: 2.40, exit_price: 2.39, outcome: 'win', pnl_pct: 11.16 },
    { asset: 'DOGE', direction: 'SHORT', entry_price: 0.172, stop_loss: 0.182, take_profit: 0.152, exit_price: 0.183, outcome: 'loss', pnl_pct: -6.40 },
    { asset: 'ETH', direction: 'LONG', entry_price: 1750, stop_loss: 1680, take_profit: 1900, exit_price: 1895, outcome: 'win', pnl_pct: 8.29 },
    { asset: 'BTC', direction: 'LONG', entry_price: 79800, stop_loss: 77500, take_profit: 84500, exit_price: 84200, outcome: 'win', pnl_pct: 5.51 },
    { asset: 'SOL', direction: 'SHORT', entry_price: 142, stop_loss: 150, take_profit: 128, exit_price: 128.5, outcome: 'win', pnl_pct: 9.51 },
    { asset: 'XRP', direction: 'SHORT', entry_price: 2.45, stop_loss: 2.60, take_profit: 2.20, exit_price: 2.59, outcome: 'loss', pnl_pct: -5.71 },
    { asset: 'BTC', direction: 'LONG', entry_price: 77200, stop_loss: 74800, take_profit: 82000, exit_price: 81500, outcome: 'win', pnl_pct: 5.57 },
    { asset: 'ETH', direction: 'SHORT', entry_price: 2100, stop_loss: 2200, take_profit: 1900, exit_price: 1910, outcome: 'win', pnl_pct: 9.05 },
  ];

  const hours = [96, 84, 72, 60, 52, 48, 40, 36, 28, 20, 12, 4];
  const stmt = db.prepare(`INSERT INTO signal_outcomes
    (asset, direction, entry_price, stop_loss, take_profit, exit_price, outcome, pnl_pct, generated_at, closed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  demos.forEach((d, i) => {
    const gen = new Date(Date.now() - hours[i] * 3600000);
    const closed = new Date(gen.getTime() + 4 * 3600000);
    stmt.run(d.asset, d.direction, d.entry_price, d.stop_loss, d.take_profit, d.exit_price, d.outcome, d.pnl_pct, gen.toISOString(), closed.toISOString());
  });
}

// ─── API Keys ─────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    key_hash TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export interface ApiKey {
  id: number;
  user_id: number;
  key_hash: string;
  created_at: string;
}

export function getApiKey(userId: number): ApiKey | undefined {
  return db
    .prepare('SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC LIMIT 1')
    .get(userId) as ApiKey | undefined;
}

export function createApiKey(userId: number): string {
  const { randomBytes, createHash } = require('crypto') as typeof import('crypto');
  const plainKey = randomBytes(32).toString('hex');
  const keyHash = createHash('sha256').update(plainKey).digest('hex');

  // Remove any existing key for this user
  db.prepare('DELETE FROM api_keys WHERE user_id = ?').run(userId);

  db.prepare('INSERT INTO api_keys (user_id, key_hash) VALUES (?, ?)').run(userId, keyHash);

  return plainKey;
}

export function getUserByApiKey(keyHash: string): (User & { plan: string; status: string }) | undefined {
  return db.prepare(`
    SELECT u.*, COALESCE(s.plan, 'basic') AS plan, COALESCE(s.status, 'inactive') AS status
    FROM api_keys ak
    JOIN users u ON u.id = ak.user_id
    LEFT JOIN subscriptions s ON s.user_id = u.id
    WHERE ak.key_hash = ?
    LIMIT 1
  `).get(keyHash) as (User & { plan: string; status: string }) | undefined;
}

// ─── Admin stats ──────────────────────────────────────────────────────────────

export interface AdminStats {
  total_users: number;
  active_subscribers: number;
  mrr: number;
  signals_today: number;
  signals_by_asset: { asset: string; count: number }[];
  recent_users: { id: number; email: string; plan: string; status: string; created_at: string }[];
  recent_signals: Signal[];
}

export function getAdminStats(): AdminStats {
  const total_users = (db.prepare('SELECT COUNT(*) AS cnt FROM users').get() as { cnt: number }).cnt;

  const active_rows = db.prepare(`
    SELECT plan, COUNT(*) AS cnt
    FROM subscriptions
    WHERE status = 'active'
    GROUP BY plan
  `).all() as { plan: string; cnt: number }[];

  let active_subscribers = 0;
  let mrr = 0;
  const PLAN_PRICE: Record<string, number> = { basic: 19, pro: 39, api: 99 };
  for (const row of active_rows) {
    active_subscribers += row.cnt;
    mrr += row.cnt * (PLAN_PRICE[row.plan] ?? 0);
  }

  const signals_today = (db.prepare(`
    SELECT COUNT(*) AS cnt FROM signals_cache
    WHERE generated_at >= datetime('now', 'start of day')
  `).get() as { cnt: number }).cnt;

  const signals_by_asset = db.prepare(`
    SELECT asset, COUNT(*) AS count
    FROM signals_cache
    GROUP BY asset
    ORDER BY count DESC
  `).all() as { asset: string; count: number }[];

  const recent_users = db.prepare(`
    SELECT u.id, u.email, COALESCE(s.plan, 'none') AS plan, COALESCE(s.status, 'none') AS status, u.created_at
    FROM users u
    LEFT JOIN subscriptions s ON s.user_id = u.id
    ORDER BY u.created_at DESC
    LIMIT 20
  `).all() as { id: number; email: string; plan: string; status: string; created_at: string }[];

  const recent_signals = db.prepare(`
    SELECT * FROM signals_cache
    ORDER BY generated_at DESC
    LIMIT 25
  `).all() as Signal[];

  return {
    total_users,
    active_subscribers,
    mrr,
    signals_today,
    signals_by_asset,
    recent_users,
    recent_signals,
  };
}

export default db;
