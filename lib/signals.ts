import fs from 'fs';
import path from 'path';

export interface SignalData {
  asset: string;
  direction: 'LONG' | 'SHORT';
  confidence: number;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  timeframe: string;
  generated_at?: string;
}

export interface SignalsFile {
  generated_at: string;
  signals: SignalData[];
}

// ─── Mock signals (realistic as of April 2026) ────────────────────────────────

const MOCK_SIGNALS: SignalData[] = [
  {
    asset: 'BTC',
    direction: 'LONG',
    confidence: 0.78,
    entry_price: 83200,
    stop_loss: 81000,
    take_profit: 87500,
    timeframe: '15m',
    generated_at: new Date().toISOString(),
  },
  {
    asset: 'ETH',
    direction: 'LONG',
    confidence: 0.71,
    entry_price: 1820,
    stop_loss: 1760,
    take_profit: 1950,
    timeframe: '10m',
    generated_at: new Date().toISOString(),
  },
  {
    asset: 'SOL',
    direction: 'SHORT',
    confidence: 0.65,
    entry_price: 132,
    stop_loss: 138,
    take_profit: 118,
    timeframe: '5m',
    generated_at: new Date().toISOString(),
  },
  {
    asset: 'XRP',
    direction: 'LONG',
    confidence: 0.69,
    entry_price: 2.21,
    stop_loss: 2.1,
    take_profit: 2.45,
    timeframe: '15m',
    generated_at: new Date().toISOString(),
  },
  {
    asset: 'DOGE',
    direction: 'SHORT',
    confidence: 0.62,
    entry_price: 0.168,
    stop_loss: 0.178,
    take_profit: 0.148,
    timeframe: '10m',
    generated_at: new Date().toISOString(),
  },
];

// ─── File reader ──────────────────────────────────────────────────────────────

export function readSignalsFromFile(): SignalData[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'signals.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed: SignalsFile = JSON.parse(raw);

    if (!Array.isArray(parsed.signals)) return [];
    return parsed.signals;
  } catch {
    return [];
  }
}

// ─── Mock signals ─────────────────────────────────────────────────────────────

export function getMockSignals(): SignalData[] {
  // Return fresh copies with current timestamps
  return MOCK_SIGNALS.map((s) => ({
    ...s,
    generated_at: new Date().toISOString(),
  }));
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatConfidence(n: number): string {
  return `${Math.round(n * 100)}%`;
}
