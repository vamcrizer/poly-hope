import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Signal } from '@/types';

interface SignalCardProps {
  signal: Signal;
}

function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  return price.toFixed(4);
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

const assetColors: Record<string, string> = {
  BTC: 'text-orange-400',
  ETH: 'text-blue-400',
  SOL: 'text-purple-400',
  XRP: 'text-cyan-400',
  DOGE: 'text-yellow-400',
};

export function SignalCard({ signal }: SignalCardProps) {
  const confidenceColor =
    signal.confidence >= 0.8
      ? 'text-emerald-400'
      : signal.confidence >= 0.6
        ? 'text-yellow-400'
        : 'text-red-400';

  const assetColor = assetColors[signal.asset] || 'text-gray-300';

  const riskReward =
    signal.direction === 'LONG'
      ? (signal.take_profit - signal.entry_price) /
        (signal.entry_price - signal.stop_loss)
      : (signal.entry_price - signal.take_profit) /
        (signal.stop_loss - signal.entry_price);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950/50">
          <div className="flex items-center gap-3">
            <span className={`text-xl font-bold ${assetColor}`}>
              {signal.asset}
            </span>
            <Badge variant={signal.direction === 'LONG' ? 'green' : 'red'}>
              {signal.direction}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="gray">{signal.timeframe}</Badge>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Confidence
            </span>
            <span className={`text-sm font-bold ${confidenceColor}`}>
              {formatPercent(signal.confidence)}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                signal.confidence >= 0.8
                  ? 'bg-emerald-500'
                  : signal.confidence >= 0.6
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${signal.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Price levels */}
        <div className="grid grid-cols-3 gap-0 px-4 pb-3 pt-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Entry
            </span>
            <span className="text-sm font-semibold text-gray-100">
              ${formatPrice(signal.entry_price)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 items-center">
            <span className="text-xs text-red-500 uppercase tracking-wide">
              Stop Loss
            </span>
            <span className="text-sm font-semibold text-red-400">
              ${formatPrice(signal.stop_loss)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 items-end">
            <span className="text-xs text-emerald-500 uppercase tracking-wide">
              Take Profit
            </span>
            <span className="text-sm font-semibold text-emerald-400">
              ${formatPrice(signal.take_profit)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-800 bg-gray-950/30">
          <span className="text-xs text-gray-600">
            R:R {riskReward > 0 ? riskReward.toFixed(2) : '—'}x
          </span>
          <span className="text-xs text-gray-600">
            {new Date(signal.generated_at).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short',
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
