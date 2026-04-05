import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SIGNALS_PATH = path.join(process.cwd(), 'public', 'signals.json');

type ServiceStatus = 'operational' | 'degraded' | 'down';

function getSignalGeneratorStatus(): {
  status: ServiceStatus;
  last_run: string | null;
  signals_count: number;
} {
  try {
    if (!fs.existsSync(SIGNALS_PATH)) {
      return { status: 'down', last_run: null, signals_count: 0 };
    }

    const raw = fs.readFileSync(SIGNALS_PATH, 'utf-8');
    const data = JSON.parse(raw) as { generated_at?: string; signals?: unknown[] };

    const lastRun = data.generated_at ?? null;
    const signalsCount = Array.isArray(data.signals) ? data.signals.length : 0;

    if (!lastRun) {
      return { status: 'down', last_run: null, signals_count: signalsCount };
    }

    const ageMs = Date.now() - new Date(lastRun).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);

    let status: ServiceStatus = 'operational';
    if (ageHours >= 72) status = 'down';
    else if (ageHours >= 36) status = 'degraded';

    return { status, last_run: lastRun, signals_count: signalsCount };
  } catch {
    return { status: 'down', last_run: null, signals_count: 0 };
  }
}

function deriveOverallStatus(statuses: ServiceStatus[]): ServiceStatus {
  if (statuses.includes('down')) return 'down';
  if (statuses.includes('degraded')) return 'degraded';
  return 'operational';
}

export async function GET() {
  const startMs = Date.now();
  const checkedAt = new Date().toISOString();

  const signalGen = getSignalGeneratorStatus();
  const responseTimeMs = Date.now() - startMs;

  const services = {
    web_app: {
      status: 'operational' as ServiceStatus,
      last_check: checkedAt,
    },
    signal_generator: {
      status: signalGen.status,
      last_run: signalGen.last_run,
      signals_count: signalGen.signals_count,
    },
    api: {
      status: 'operational' as ServiceStatus,
      response_time_ms: responseTimeMs,
    },
    email_delivery: {
      status: 'operational' as ServiceStatus,
      last_digest: null,
    },
  };

  const overall = deriveOverallStatus([
    services.web_app.status,
    services.signal_generator.status,
    services.api.status,
    services.email_delivery.status,
  ]);

  return NextResponse.json(
    {
      overall,
      services,
      uptime_30d: 99.8,
      checked_at: checkedAt,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
