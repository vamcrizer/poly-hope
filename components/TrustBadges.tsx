export function TrustBadges() {
  const badges = [
    { emoji: '📊', value: '89%', label: 'Backtest Accuracy' },
    { emoji: '🤖', value: 'LightGBM', label: 'AI Model' },
    { emoji: '⚡', value: '1,200+', label: 'Signals Generated' },
    { emoji: '🔓', value: 'Cancel Anytime', label: 'No Contracts' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {badges.map((b) => (
        <div
          key={b.label}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/60 border border-gray-700/50 text-sm"
        >
          <span>{b.emoji}</span>
          <span className="font-semibold text-white">{b.value}</span>
          <span className="text-gray-400">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
