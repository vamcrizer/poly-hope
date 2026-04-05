import React from 'react';

type BadgeVariant = 'green' | 'red' | 'gray' | 'yellow' | 'blue';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  green:
    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ring-1 ring-emerald-500/20',
  red: 'bg-red-500/15 text-red-400 border border-red-500/30 ring-1 ring-red-500/20',
  gray: 'bg-gray-700/50 text-gray-400 border border-gray-600/50',
  yellow:
    'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 ring-1 ring-yellow-500/20',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30 ring-1 ring-blue-500/20',
};

export function Badge({ variant = 'gray', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold tracking-wide uppercase ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
