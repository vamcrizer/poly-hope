import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const asset = searchParams.get('asset') ?? 'BTC';
  const direction = searchParams.get('dir') ?? 'LONG';
  const confidence = searchParams.get('conf') ?? '0.75';
  const entry = searchParams.get('entry') ?? '';

  const isLong = direction === 'LONG';
  const confidencePct = Math.round(parseFloat(confidence) * 100);

  const bgColor = '#0a0a0f';
  const accentColor = isLong ? '#10b981' : '#ef4444';
  const directionBg = isLong ? '#052e16' : '#450a0a';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: bgColor,
          fontFamily: 'system-ui, sans-serif',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ fontSize: '28px' }}>⚡</div>
          <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Polymarket Signals
          </div>
          <div style={{ marginLeft: 'auto', backgroundColor: '#10b98120', border: '1px solid #10b98140', borderRadius: '20px', padding: '6px 14px', color: '#10b981', fontSize: '13px', fontWeight: '600' }}>
            Live Signal
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '40px', flex: 1 }}>
          {/* Left: Signal info */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Asset + direction */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '72px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.04em' }}>
                {asset}
              </div>
              <div
                style={{
                  backgroundColor: directionBg,
                  border: `2px solid ${accentColor}40`,
                  borderRadius: '12px',
                  padding: '10px 20px',
                  color: accentColor,
                  fontSize: '28px',
                  fontWeight: '800',
                  letterSpacing: '0.05em',
                }}
              >
                {direction}
              </div>
            </div>

            {/* Confidence */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#9ca3af', fontSize: '16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  AI Confidence
                </span>
                <span style={{ color: accentColor, fontSize: '24px', fontWeight: '800' }}>
                  {confidencePct}%
                </span>
              </div>
              <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
                <div
                  style={{
                    backgroundColor: accentColor,
                    height: '12px',
                    width: `${confidencePct}%`,
                    borderRadius: '8px',
                  }}
                />
              </div>
            </div>

            {/* Entry price */}
            {entry && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#6b7280', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Entry
                </span>
                <span style={{ color: '#e5e7eb', fontSize: '28px', fontWeight: '700', fontFamily: 'monospace' }}>
                  ${entry}
                </span>
              </div>
            )}
          </div>

          {/* Right: Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '280px' }}>
            {[
              { label: 'Strategy', value: 'RSI + MACD + ATR' },
              { label: 'Risk:Reward', value: '2.5:1 target' },
              { label: 'Timeframe', value: '15m candles' },
              { label: 'Updated', value: '8AM UTC daily' },
            ].map((item) => (
              <div key={item.label} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {item.label}
                </div>
                <div style={{ color: '#e5e7eb', fontSize: '16px', fontWeight: '600' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #1f2937' }}>
          <div style={{ color: '#4b5563', fontSize: '14px' }}>
            polymarketsignals.com
          </div>
          <div style={{ color: '#4b5563', fontSize: '14px' }}>
            Not financial advice. Trade at your own risk.
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
