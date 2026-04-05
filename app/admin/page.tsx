'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Signal } from '@/types';

interface AdminStats {
  total_users: number;
  active_subscribers: number;
  mrr: number;
  signals_today: number;
  signals_by_asset: { asset: string; count: number }[];
  recent_users: { id: number; email: string; plan: string; status: string; created_at: string }[];
  recent_signals: Signal[];
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    api: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    pro: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    basic: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    none: 'bg-gray-700/40 text-gray-500 border-gray-700/30',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[plan] ?? colors.none}`}
    >
      {plan}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === 'active'
      ? 'bg-emerald-400'
      : status === 'past_due'
      ? 'bg-yellow-400'
      : 'bg-gray-600';
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-sm text-gray-400 capitalize">{status}</span>
    </span>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');

  // Check if already authenticated via admin_session cookie
  useEffect(() => {
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${getLocalSecret()}` },
    }).then((r) => {
      if (r.ok) {
        setAuthenticated(true);
      } else {
        // Try cookie-based check by sending a probe
        setAuthenticated(false);
      }
    });
  }, []);

  const fetchStats = useCallback(() => {
    setStatsLoading(true);
    setStatsError('');
    const secret = getLocalSecret();
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${secret}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error('Unauthorized');
        return r.json();
      })
      .then((data: AdminStats) => {
        setStats(data);
        setStatsLoading(false);
      })
      .catch(() => {
        setStatsError('Failed to load stats. Check your admin secret.');
        setStatsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchStats();
    }
  }, [authenticated, fetchStats]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      // Store in sessionStorage for the Authorization header on future requests
      sessionStorage.setItem('admin_secret', password);
      setAuthenticated(true);
    } else {
      setLoginError('Invalid password. Check ADMIN_SECRET env var.');
    }
    setLoginLoading(false);
  };

  // While checking
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Login gate
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-3xl">🔒</span>
            <h1 className="text-2xl font-bold text-white mt-3">Admin Access</h1>
            <p className="text-gray-500 text-sm mt-1">Polymarket Signals — Admin Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter ADMIN_SECRET"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold transition-colors"
            >
              {loginLoading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Max bar value for chart
  const maxCount =
    stats?.signals_by_asset.reduce((m, s) => Math.max(m, s.count), 1) ?? 1;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-emerald-400">⚡</span>
            <span className="font-semibold text-white">Polymarket Signals</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-500/10 text-red-400 border border-red-500/20">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchStats}
              disabled={statsLoading}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50"
            >
              {statsLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('admin_secret');
                setAuthenticated(false);
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {statsError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
            {statsError}
          </div>
        )}

        {/* Stats Cards */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={stats?.total_users ?? '—'} />
            <StatCard label="Active Subscribers" value={stats?.active_subscribers ?? '—'} />
            <StatCard
              label="MRR"
              value={stats ? `$${stats.mrr.toLocaleString()}` : '—'}
            />
            <StatCard label="Signals Today" value={stats?.signals_today ?? '—'} />
          </div>
        </section>

        {/* Signals by Asset — CSS Bar Chart */}
        {stats && stats.signals_by_asset.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Signals by Asset</h2>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6">
              <div className="space-y-3">
                {stats.signals_by_asset.map((row) => (
                  <div key={row.asset} className="flex items-center gap-4">
                    <span className="w-12 text-sm font-mono text-gray-300 text-right shrink-0">
                      {row.asset}
                    </span>
                    <div className="flex-1 h-6 bg-gray-800 rounded overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded transition-all duration-500"
                        style={{ width: `${(row.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-sm text-gray-400 text-right shrink-0">
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recent Signals Table */}
        {stats && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              Recent Signals
              <span className="ml-2 text-sm font-normal text-gray-500">(last 25)</span>
            </h2>
            <div className="rounded-xl border border-gray-800 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-900/80">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Asset</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Direction</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Confidence</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">TF</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {stats.recent_signals.map((sig) => (
                    <tr key={sig.id} className="bg-gray-900/30 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-gray-500 font-mono">#{sig.id}</td>
                      <td className="px-4 py-3 font-semibold text-white">{sig.asset}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                            sig.direction === 'LONG'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {sig.direction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {(sig.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-400 text-xs">
                        {sig.timeframe ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(sig.generated_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {stats.recent_signals.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-600">
                        No signals yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Recent Users Table */}
        {stats && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              Recent Users
              <span className="ml-2 text-sm font-normal text-gray-500">(last 20)</span>
            </h2>
            <div className="rounded-xl border border-gray-800 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-900/80">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {stats.recent_users.map((u) => (
                    <tr key={u.id} className="bg-gray-900/30 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-gray-500 font-mono">#{u.id}</td>
                      <td className="px-4 py-3 text-gray-200">{u.email}</td>
                      <td className="px-4 py-3">
                        <PlanBadge plan={u.plan} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusDot status={u.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {stats.recent_users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-600">
                        No users yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function getLocalSecret(): string {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('admin_secret') ?? '';
  }
  return '';
}
