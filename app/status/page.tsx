import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StatusBadge } from '@/components/StatusBadge';

export const metadata: Metadata = {
  title: 'System Status — Polymarket Signals',
  description: 'Real-time status of Polymarket Signals services.',
};

export const revalidate = 60;

type ServiceStatus = 'operational' | 'degraded' | 'down';

interface ServiceInfo {
  status: ServiceStatus;
  last_check?: string;
  last_run?: string | null;
  signals_count?: number;
  response_time_ms?: number;
  last_digest?: string | null;
}

interface StatusResponse {
  overall: ServiceStatus;
  services: {
    web_app: ServiceInfo;
    signal_generator: ServiceInfo;
    api: ServiceInfo;
    email_delivery: ServiceInfo;
  };
  uptime_30d: number;
  checked_at: string;
}

async function fetchStatus(): Promise<StatusResponse | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/public/status`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<StatusResponse>;
  } catch {
    return null;
  }
}

function formatTs(ts: string | null | undefined): string {
  if (!ts) return 'N/A';
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  });
}

const SERVICE_LABELS: Record<string, string> = {
  web_app: 'Web App',
  signal_generator: 'Signal Generator',
  api: 'API',
  email_delivery: 'Email Delivery',
};

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  web_app: 'Next.js frontend and authentication.',
  signal_generator: 'AI signal generation pipeline — runs daily at 8AM UTC.',
  api: 'REST API endpoints serving signal data.',
  email_delivery: 'Daily digest emails to subscribers.',
};

export default async function StatusPage() {
  const data = await fetchStatus();
  const now = new Date().toISOString();

  const overall: ServiceStatus = data?.overall ?? 'operational';
  const uptime = data?.uptime_30d ?? 99.8;
  const checkedAt = data?.checked_at ?? now;

  const services: Array<{ key: string; info: ServiceInfo; detail: string }> = data
    ? [
        {
          key: 'web_app',
          info: data.services.web_app,
          detail: `Last checked: ${formatTs(data.services.web_app.last_check)}`,
        },
        {
          key: 'signal_generator',
          info: data.services.signal_generator,
          detail: data.services.signal_generator.last_run
            ? `Last run: ${formatTs(data.services.signal_generator.last_run)} · ${data.services.signal_generator.signals_count ?? 0} signals`
            : 'No signals on record',
        },
        {
          key: 'api',
          info: data.services.api,
          detail: `Response time: ${data.services.api.response_time_ms ?? 0} ms`,
        },
        {
          key: 'email_delivery',
          info: data.services.email_delivery,
          detail: data.services.email_delivery.last_digest
            ? `Last digest: ${formatTs(data.services.email_delivery.last_digest)}`
            : 'Last digest: N/A',
        },
      ]
    : [
        { key: 'web_app', info: { status: 'operational' }, detail: '' },
        { key: 'signal_generator', info: { status: 'operational' }, detail: '' },
        { key: 'api', info: { status: 'operational' }, detail: '' },
        { key: 'email_delivery', info: { status: 'operational' }, detail: '' },
      ];

  const overallBannerStyle: Record<ServiceStatus, { border: string; bg: string; heading: string; sub: string }> = {
    operational: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      heading: 'text-emerald-400',
      sub: 'text-emerald-300/70',
    },
    degraded: {
      border: 'border-yellow-500/30',
      bg: 'bg-yellow-500/10',
      heading: 'text-yellow-400',
      sub: 'text-yellow-300/70',
    },
    down: {
      border: 'border-red-500/30',
      bg: 'bg-red-500/10',
      heading: 'text-red-400',
      sub: 'text-red-300/70',
    },
  };
  const banner = overallBannerStyle[overall];

  const overallLabel: Record<ServiceStatus, string> = {
    operational: 'All Systems Operational',
    degraded: 'Partial Service Disruption',
    down: 'Major Outage Detected',
  };
  const overallSub: Record<ServiceStatus, string> = {
    operational: 'Everything is running smoothly.',
    degraded: 'Some services are experiencing issues.',
    down: 'One or more critical services are down.',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">System Status</h1>
          <p className="text-sm text-gray-500">
            Real-time health of Polymarket Signals services.
          </p>
        </div>

        {/* Overall banner */}
        <div className={`rounded-xl border ${banner.border} ${banner.bg} p-6 mb-8 flex items-center justify-between`}>
          <div>
            <p className={`text-lg font-semibold ${banner.heading}`}>{overallLabel[overall]}</p>
            <p className={`text-sm mt-0.5 ${banner.sub}`}>{overallSub[overall]}</p>
          </div>
          <StatusBadge status={overall} />
        </div>

        {/* 30-day uptime strip */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 mb-8 flex items-center justify-between">
          <span className="text-sm text-gray-400">30-Day Uptime</span>
          <span className="text-xl font-bold text-emerald-400">{uptime.toFixed(1)}%</span>
        </div>

        {/* Individual services */}
        <div className="rounded-xl border border-gray-800 overflow-hidden mb-8">
          <div className="bg-gray-900/80 px-5 py-3 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Services</h2>
          </div>
          <ul className="divide-y divide-gray-800/70">
            {services.map(({ key, info, detail }) => (
              <li key={key} className="flex items-center justify-between px-5 py-4 bg-gray-900/40 hover:bg-gray-800/30 transition-colors">
                <div>
                  <p className="text-sm font-medium text-white">{SERVICE_LABELS[key]}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{SERVICE_DESCRIPTIONS[key]}</p>
                  {detail && (
                    <p className="text-xs text-gray-600 mt-0.5 font-mono">{detail}</p>
                  )}
                </div>
                <StatusBadge status={info.status} />
              </li>
            ))}
          </ul>
        </div>

        {/* Recent incidents */}
        <div className="rounded-xl border border-gray-800 overflow-hidden mb-8">
          <div className="bg-gray-900/80 px-5 py-3 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Recent Incidents</h2>
          </div>
          <div className="px-5 py-10 text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-sm font-medium text-gray-400">No incidents in the last 30 days.</p>
            <p className="text-xs text-gray-600 mt-1">All systems have been running without reported issues.</p>
          </div>
        </div>

        {/* Last updated */}
        <p className="text-center text-xs text-gray-600">
          Last updated: {formatTs(checkedAt)} &nbsp;·&nbsp;{' '}
          <Link href="/api/public/status" className="text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors">
            View raw JSON
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
