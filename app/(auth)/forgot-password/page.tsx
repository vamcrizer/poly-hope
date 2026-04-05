'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  function validate(): boolean {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      // Always show success regardless of whether the email exists (security)
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Check your email</h1>
            <p className="text-gray-500 text-sm mt-1">
              We&apos;ve sent a 6-digit reset code to{' '}
              <span className="text-gray-300 font-medium">{email}</span>
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl px-5 py-4 space-y-2 text-sm text-gray-400">
            <p className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              The code expires in <span className="text-white font-medium">15 minutes</span>.
            </p>
            <p className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Check your spam folder if you don&apos;t see it.
            </p>
            <p className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You can request a new code after 1 hour.
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex flex-col items-center gap-3 w-full text-sm">
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setEmail('');
              }}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Try a different email address
            </button>
            <Link
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Forgot password?</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email and we&apos;ll send you a reset code.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        {/* Global error */}
        {error && (
          <div className="mb-4 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <svg
              className="w-4 h-4 text-red-400 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            error={emailError}
            autoComplete="email"
            required
          />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            {loading ? 'Sending reset code...' : 'Send reset code'}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-center text-sm text-gray-500 w-full">
          Remember your password?{' '}
          <Link
            href="/login"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            Back to login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
