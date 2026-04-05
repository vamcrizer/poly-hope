const badges = [
  {
    icon: (
      <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    label: '89% Backtest Accuracy',
    sub: '6-month backtest, 1,200+ signals',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    label: '1,200+ Signals Generated',
    sub: 'Across 5 crypto assets',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    label: 'Powered by LightGBM AI',
    sub: 'Trained on order flow & on-chain data',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    label: 'No BS, Cancel Anytime',
    sub: 'No contracts or lock-in',
  },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex items-start gap-3 bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-700 transition-colors duration-200"
        >
          <div className="mt-0.5">{badge.icon}</div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-tight">{badge.label}</p>
            <p className="text-gray-500 text-xs mt-0.5 leading-tight">{badge.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
