import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/4 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-bold text-lg hover:text-emerald-400 transition-colors"
          >
            <span className="text-xl">⚡</span>
            <span>Polymarket Signals</span>
          </Link>
        </div>
      </header>

      {/* Centered content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Footer note */}
      <div className="relative z-10 text-center pb-6">
        <p className="text-xs text-gray-700">
          &copy; 2026 Polymarket Signals. Not financial advice.
        </p>
      </div>
    </div>
  );
}
