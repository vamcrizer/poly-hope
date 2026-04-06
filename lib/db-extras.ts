import db from '@/lib/db';

// ─── Schema ───────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    telegram_chat_id TEXT,
    email_alerts_enabled INTEGER NOT NULL DEFAULT 1,
    slack_webhook_url TEXT,
    discord_webhook_url TEXT,
    min_confidence REAL NOT NULL DEFAULT 0,
    alert_assets TEXT NOT NULL DEFAULT 'BTC,ETH,SOL,XRP,DOGE',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referrer_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    code TEXT UNIQUE NOT NULL,
    converted_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserSettings {
  id: number;
  user_id: number;
  telegram_chat_id: string | null;
  email_alerts_enabled: number; // SQLite boolean: 1 = true, 0 = false
  slack_webhook_url: string | null;
  discord_webhook_url: string | null;
  min_confidence: number; // 0.0–1.0
  alert_assets: string; // comma-separated, default 'BTC,ETH,SOL,XRP,DOGE'
  created_at: string;
}

export interface Referral {
  id: number;
  referrer_user_id: number;
  referred_user_id: number | null;
  code: string;
  converted_at: string | null;
  created_at: string;
}

export interface ReferralStats {
  code: string | null;
  referrals_count: number;
  pending_count: number;
}

// ─── user_settings helpers ────────────────────────────────────────────────────

export function getUserSettings(userId: number): UserSettings | undefined {
  return db
    .prepare('SELECT * FROM user_settings WHERE user_id = ?')
    .get(userId) as UserSettings | undefined;
}

export function upsertUserSettings(
  userId: number,
  settings: Partial<Pick<UserSettings, 'telegram_chat_id' | 'email_alerts_enabled' | 'slack_webhook_url' | 'discord_webhook_url' | 'min_confidence' | 'alert_assets'>>,
): void {
  const existing = getUserSettings(userId);

  if (existing) {
    db.prepare(`
      UPDATE user_settings SET
        telegram_chat_id = COALESCE(?, telegram_chat_id),
        email_alerts_enabled = COALESCE(?, email_alerts_enabled),
        slack_webhook_url = COALESCE(?, slack_webhook_url),
        discord_webhook_url = COALESCE(?, discord_webhook_url),
        min_confidence = COALESCE(?, min_confidence),
        alert_assets = COALESCE(?, alert_assets)
      WHERE user_id = ?
    `).run(
      settings.telegram_chat_id ?? null,
      settings.email_alerts_enabled ?? null,
      settings.slack_webhook_url ?? null,
      settings.discord_webhook_url ?? null,
      settings.min_confidence ?? null,
      settings.alert_assets ?? null,
      userId,
    );
  } else {
    db.prepare(`
      INSERT INTO user_settings (user_id, telegram_chat_id, email_alerts_enabled, slack_webhook_url, discord_webhook_url, min_confidence, alert_assets)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      settings.telegram_chat_id ?? null,
      settings.email_alerts_enabled ?? 1,
      settings.slack_webhook_url ?? null,
      settings.discord_webhook_url ?? null,
      settings.min_confidence ?? 0,
      settings.alert_assets ?? 'BTC,ETH,SOL,XRP,DOGE',
    );
  }
}

// ─── referrals helpers ────────────────────────────────────────────────────────

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  const { randomBytes } = require('crypto') as typeof import('crypto');
  const bytes = randomBytes(8);
  for (let i = 0; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

export function createReferralCode(userId: number): string {
  // Return existing code if present
  const existing = db
    .prepare('SELECT code FROM referrals WHERE referrer_user_id = ? AND referred_user_id IS NULL LIMIT 1')
    .get(userId) as { code: string } | undefined;
  if (existing) return existing.code;

  let code: string;
  // Guard against (unlikely) collision
  for (let attempt = 0; attempt < 10; attempt++) {
    code = generateCode();
    const clash = db
      .prepare('SELECT id FROM referrals WHERE code = ?')
      .get(code);
    if (!clash) break;
  }

  db.prepare(`
    INSERT INTO referrals (referrer_user_id, code)
    VALUES (?, ?)
  `).run(userId, code!);

  return code!;
}

export function getReferralCode(userId: number): string | null {
  const row = db
    .prepare('SELECT code FROM referrals WHERE referrer_user_id = ? LIMIT 1')
    .get(userId) as { code: string } | undefined;
  return row?.code ?? null;
}

export function getReferralStats(userId: number): ReferralStats {
  const codeRow = db
    .prepare('SELECT code FROM referrals WHERE referrer_user_id = ? LIMIT 1')
    .get(userId) as { code: string } | undefined;

  const code = codeRow?.code ?? null;

  if (!code) {
    return { code: null, referrals_count: 0, pending_count: 0 };
  }

  const totals = db.prepare(`
    SELECT
      COUNT(*) AS referrals_count,
      SUM(CASE WHEN converted_at IS NOT NULL THEN 1 ELSE 0 END) AS converted_count
    FROM referrals
    WHERE referrer_user_id = ? AND referred_user_id IS NOT NULL
  `).get(userId) as { referrals_count: number; converted_count: number };

  const referrals_count = totals.referrals_count ?? 0;
  const converted_count = totals.converted_count ?? 0;
  const pending_count = referrals_count - converted_count;

  return { code, referrals_count, pending_count };
}

export function applyReferral(code: string, referredUserId: number): void {
  // Find the referral row that has no referred user yet and matches the code
  const row = db
    .prepare('SELECT id, referrer_user_id FROM referrals WHERE code = ? AND referred_user_id IS NULL')
    .get(code) as { id: number; referrer_user_id: number } | undefined;

  if (!row) return; // code invalid or already used

  // Prevent self-referral
  if (row.referrer_user_id === referredUserId) return;

  db.prepare(`
    UPDATE referrals SET
      referred_user_id = ?,
      converted_at = datetime('now')
    WHERE id = ?
  `).run(referredUserId, row.id);
}
