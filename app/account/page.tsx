'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PLAN_PRICES } from '@/types';
import type { Subscription } from '@/types';

type UserData = {
  id: number;
  email: string;
  created_at: string;
  subscription: Subscription | null;
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    fetch('/api/user/me')
      .then((r) => {
        if (r.status === 401) { router.push('/login'); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setUser(data);
        setLoading(false);
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    setCancelling(true);
    const res = await fetch('/api/stripe/cancel', { method: 'POST' });
    if (res.ok) {
      window.location.reload();
    } else {
      alert('Failed to cancel subscription. Please try again.');
      setCancelling(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    setPasswordChanging(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.error || 'Failed to update password');
      }
    } catch {
      setPasswordError('An unexpected error occurred');
    } finally {
      setPasswordChanging(false);
    }
  };

  const handleManageBilling = async () => {
    setOpeningPortal(true);
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    const data = await res.json();
    if (data.url) {
      window.location.assign(data.url);
    } else {
      alert('Could not open billing portal. Please try again.');
      setOpeningPortal(false);
    }
  };

  const handleUpgrade = async (plan: 'basic' | 'pro' | 'api') => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) window.location.assign(data.url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sub = user?.subscription;
  const isActive = sub?.status === 'active';
  const planInfo = sub?.plan ? PLAN_PRICES[sub.plan as keyof typeof PLAN_PRICES] : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            ← Dashboard
          </a>
          <span className="font-semibold text-white">Account Settings</span>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        {/* Profile */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Profile</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <span className="text-sm text-gray-400">Email</span>
              <span className="text-sm text-white font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-400">Member since</span>
              <span className="text-sm text-white">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Subscription</h2>

          {isActive && planInfo ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">Current plan</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-medium">{planInfo.label}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">Monthly price</span>
                <span className="text-sm text-white">${planInfo.monthly}/mo</span>
              </div>
              {sub?.current_period_end && (
                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                  <span className="text-sm text-gray-400">Next billing date</span>
                  <span className="text-sm text-white">
                    {new Date(sub.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )}
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={handleManageBilling}
                  disabled={openingPortal}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50"
                >
                  {openingPortal ? 'Opening...' : 'Manage billing & invoices →'}
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel subscription'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-700 text-gray-400">
                  {sub?.status === 'cancelled' ? 'Cancelled' : 'No active subscription'}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe to access daily signals and all premium features.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(Object.entries(PLAN_PRICES) as [keyof typeof PLAN_PRICES, typeof PLAN_PRICES[keyof typeof PLAN_PRICES]][]).map(([key, plan]) => (
                  <button
                    key={key}
                    onClick={() => handleUpgrade(key)}
                    className="p-4 rounded-lg border border-gray-700 hover:border-emerald-500/50 bg-gray-800/50 hover:bg-gray-800 transition-all text-left"
                  >
                    <p className="font-semibold text-white mb-1">{plan.label}</p>
                    <p className="text-emerald-400 font-mono text-lg">${plan.monthly}<span className="text-gray-500 text-sm">/mo</span></p>
                    <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Change Password */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Min. 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {passwordError && (
              <p className="text-sm text-red-400">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-emerald-400">{passwordSuccess}</p>
            )}

            <button
              onClick={handleChangePassword}
              disabled={passwordChanging || !currentPassword || !newPassword || !confirmPassword}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors"
            >
              {passwordChanging ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
