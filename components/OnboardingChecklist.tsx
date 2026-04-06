'use client';

import { useEffect, useState } from 'react';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  href: string;
  completed: boolean;
}

interface Props {
  hasTelegram: boolean;
  hasApiKey: boolean;
  hasViewedSignals: boolean;
  onDismiss: () => void;
}

function CheckIcon({ done }: { done: boolean }) {
  if (done) {
    return (
      <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  return (
    <span className="w-5 h-5 rounded-full border-2 border-gray-600 shrink-0" />
  );
}

export function OnboardingChecklist({ hasTelegram, hasApiKey, hasViewedSignals, onDismiss }: Props) {
  const items: ChecklistItem[] = [
    {
      id: 'signals',
      label: 'View your first signal',
      description: 'Signals update every day at 8AM UTC with entry, stop loss, and take profit.',
      href: '#signals',
      completed: hasViewedSignals,
    },
    {
      id: 'telegram',
      label: 'Connect Telegram alerts',
      description: 'Get notified instantly when new signals are published.',
      href: '/dashboard/settings',
      completed: hasTelegram,
    },
    {
      id: 'export',
      label: 'Download your first CSV export',
      description: 'Export signals as CSV for spreadsheet analysis or backtesting.',
      href: '/api/signals/export',
      completed: false,
    },
    {
      id: 'apikey',
      label: 'Get your API key',
      description: 'Integrate live signals directly into your trading systems.',
      href: '/dashboard/api-key',
      completed: hasApiKey,
    },
  ];

  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const allDone = completed === total;
  const pct = Math.round((completed / total) * 100);

  if (allDone) return null;

  return (
    <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white">Getting started</span>
          <span className="text-xs text-gray-500">{completed}/{total} completed</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{pct}%</span>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-600 hover:text-gray-400 transition-colors"
            aria-label="Dismiss checklist"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-800/50">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.completed ? undefined : item.href}
            className={`flex items-start gap-3 px-5 py-3.5 transition-colors ${
              item.completed
                ? 'opacity-50 cursor-default'
                : 'hover:bg-gray-800/40 cursor-pointer'
            }`}
          >
            <div className="mt-0.5">
              <CheckIcon done={item.completed} />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-medium ${item.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                {item.label}
              </p>
              {!item.completed && (
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              )}
            </div>
            {!item.completed && (
              <svg className="w-4 h-4 text-gray-600 shrink-0 mt-0.5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
