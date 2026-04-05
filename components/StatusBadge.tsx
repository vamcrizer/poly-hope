type Status = 'operational' | 'degraded' | 'down';

interface StatusBadgeProps {
  status: Status;
}

const config: Record<Status, { dot: string; label: string; text: string; pulse: boolean }> = {
  operational: {
    dot: 'bg-emerald-500',
    label: 'Operational',
    text: 'text-emerald-400',
    pulse: true,
  },
  degraded: {
    dot: 'bg-yellow-500',
    label: 'Degraded',
    text: 'text-yellow-400',
    pulse: false,
  },
  down: {
    dot: 'bg-red-500',
    label: 'Down',
    text: 'text-red-400',
    pulse: false,
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = config[status];

  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        {cfg.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-60`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cfg.dot}`} />
      </span>
      <span className={`text-sm font-medium ${cfg.text}`}>{cfg.label}</span>
    </span>
  );
}
