import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Signal } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatPrice(value: number): string {
  if (value >= 1000) return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  if (value >= 1) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(6)}`;
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.75) return 'text-emerald-400';
  if (confidence >= 0.65) return 'text-yellow-400';
  return 'text-orange-400';
}

export function getDirectionColor(direction: 'LONG' | 'SHORT'): string {
  return direction === 'LONG' ? 'text-emerald-400' : 'text-red-400';
}

export function getDirectionBg(direction: 'LONG' | 'SHORT'): string {
  return direction === 'LONG'
    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    : 'bg-red-500/10 text-red-400 border border-red-500/20';
}

export function calcRiskReward(signal: Signal): string {
  const risk = Math.abs(signal.entry_price - signal.stop_loss);
  const reward = Math.abs(signal.take_profit - signal.entry_price);
  if (risk === 0) return 'N/A';
  return `${(reward / risk).toFixed(1)}R`;
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function isSubscriptionActive(status: string | null | undefined): boolean {
  return status === 'active';
}
