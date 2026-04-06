'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

interface FieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validate(): boolean {
    const errs: FieldErrors = {};

    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      errs.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(password)) {
      errs.password = 'Password must contain at least one number';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const utmSource = searchParams.get('utm_source') ?? undefined;
      const utmMedium = searchParams.get('utm_medium') ?? undefined;
      const utmCampaign = searchParams.get('utm_campaign') ?? undefined;
      const refCode = searchParams.get('ref') ?? undefined;

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, utmSource, utmMedium, utmCampaign, refCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.toLowerCase().includes('email')) {
          setFieldErrors({ email: data.error });
        } else {
          setError(data.error || 'Failed to create account. Please try again.');
        }
        return;
      }

      router.push('/pricing');
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const passwordStrength = (() => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' };
    if (score <= 3) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-2/3' };
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  })();

  return (
    <Card>
      <CardHeader>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">
            Start your 7-day free trial — no credit card required
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
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={fieldErrors.email}
            autoComplete="email"
            required
          />

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password)
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={fieldErrors.password}
              autoComplete="new-password"
              required
            />
            {/* Password strength indicator */}
            {passwordStrength && !fieldErrors.password && (
              <div className="mt-2">
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}
                  />
                </div>
                <p
                  className={`text-xs mt-1 ${
                    passwordStrength.label === 'Strong'
                      ? 'text-emerald-400'
                      : passwordStrength.label === 'Fair'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }`}
                >
                  {passwordStrength.label} password
                </p>
              </div>
            )}
          </div>

          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword)
                setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            error={fieldErrors.confirmPassword}
            autoComplete="new-password"
            required
          />

          <p className="text-xs text-gray-600 leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            .
          </p>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            {loading ? 'Creating account...' : 'Create free account'}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-center text-sm text-gray-500 w-full">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
