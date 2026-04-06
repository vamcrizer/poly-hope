'use client';

import { useState } from 'react';
import Link from 'next/link';

const MONTHLY_PRICES = { Basic: 19, Pro: 39, API: 99 };
const ANNUAL_PRICES = { Basic: 16, Pro: 33, API: 83 };

const plans = [
  {
    name: 'Basic' as const,
    description: 'For retail traders getting started with prediction markets.',
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Pro' as const,
    description: 'For serious traders who want deeper analysis.',
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'API' as const,
    description: 'For developers and algorithmic traders.',
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: false,
    badge: null,
  },
];

export function PricingPlans() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${annual ? 'bg-emerald-500' : 'bg-gray-700'}`}
            aria-label="Toggle annual billing"
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${annual ? 'translate-x-6' : 'translate-x-0'}`}
            />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-white' : 'text-gray-500'}`}>
            Annual
            <span className="ml-2 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Save 17%
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const price = annual ? ANNUAL_PRICES[plan.name] : MONTHLY_PRICES[plan.name];
            const originalPrice = MONTHLY_PRICES[plan.name];
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-7 flex flex-col transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-gray-900 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/20'
                    : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg shadow-emerald-500/30">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">${price}</span>
                    <span className="text-gray-500 text-sm">/mo</span>
                    {annual && (
                      <span className="text-sm text-gray-600 line-through">${originalPrice}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {annual ? `Billed $${price * 12}/year. Cancel anytime.` : 'Billed monthly. Cancel anytime.'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 mb-5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5 w-fit">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  7-day money-back guarantee
                </div>

                <Link
                  href={plan.href}
                  className={`w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    plan.highlighted
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500 shadow-lg shadow-emerald-500/25'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
