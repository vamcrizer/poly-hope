'use client';

import { useEffect, useState } from 'react';

function getNextSignalTime(): Date {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(8, 0, 0, 0);
  if (next <= now) {
    next.setUTCDate(next.getUTCDate() + 1);
  }
  return next;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Generating...';
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function NextSignalCountdown() {
  const [countdown, setCountdown] = useState('');
  const [nextTime, setNextTime] = useState<Date | null>(null);

  useEffect(() => {
    const next = getNextSignalTime();
    setNextTime(next);

    const tick = () => {
      const remaining = next.getTime() - Date.now();
      setCountdown(formatCountdown(remaining));
      if (remaining <= 0) {
        setNextTime(getNextSignalTime());
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!countdown) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Next signals in <span className="font-mono text-gray-400">{countdown}</span></span>
    </div>
  );
}
