import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DocsCodeTabs } from '@/components/DocsCodeTabs';

export const metadata: Metadata = {
  title: 'API Documentation | Polymarket Signals',
  description:
    'REST API documentation for Polymarket Signals. Integrate AI-generated crypto trading signals into your trading systems.',
  robots: { index: true, follow: true },
};

const responseSchema = `{
  "signals": [
    {
      "asset": "BTC",
      "direction": "LONG",
      "confidence": 0.78,
      "entry_price": 83200,
      "stop_loss": 81000,
      "take_profit": 87500,
      "timeframe": "15m",
      "generated_at": "2026-04-06T08:00:00Z"
    }
  ],
  "generated_at": "2026-04-06T08:00:00Z"
}`;

const curlExample = `# Get all signals
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://polymarketsignals.com/api/v1/signals

# Filter by asset
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://polymarketsignals.com/api/v1/signals?asset=BTC"`;

const pythonExample = `import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://polymarketsignals.com/api/v1"

# Get all signals
resp = requests.get(
    f"{BASE_URL}/signals",
    headers={"Authorization": f"Bearer {API_KEY}"}
)
resp.raise_for_status()
signals = resp.json()["signals"]

# Filter by asset
resp = requests.get(
    f"{BASE_URL}/signals",
    params={"asset": "BTC"},
    headers={"Authorization": f"Bearer {API_KEY}"}
)
btc_signal = resp.json()["signals"][0]
print(btc_signal["direction"], btc_signal["confidence"])`;

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-20 pb-12 border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 text-purple-400 text-xs font-medium mb-4">
                  API tier required — $99/mo
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Polymarket Signals API
                </h1>
                <p className="text-gray-400 text-base mt-2 max-w-xl">
                  Programmatic access to AI-generated crypto signals. Integrate directly
                  into your trading bots, dashboards, or alert systems.
                </p>
              </div>
              <Link
                href="/pricing"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl border border-emerald-500 shadow-lg shadow-emerald-500/20 transition-all duration-150 whitespace-nowrap"
              >
                Get API Access
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
          {/* Authentication */}
          <section id="authentication">
            <h2 className="text-2xl font-bold text-white mb-6">Authentication</h2>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-4">
              <p className="text-gray-400 text-sm leading-relaxed">
                All API requests must include your API key in the{' '}
                <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs font-mono">
                  Authorization
                </code>{' '}
                header as a Bearer token. You can find and manage your API key in the{' '}
                <Link href="/dashboard/api-key" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  dashboard
                </Link>
                .
              </p>
              <div className="rounded-lg bg-gray-950 border border-gray-800 p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-mono">Header</p>
                <code className="text-sm font-mono text-gray-200">
                  Authorization: Bearer{' '}
                  <span className="text-yellow-400">YOUR_API_KEY</span>
                </code>
              </div>
              <p className="text-xs text-gray-500">
                Keep your API key secret. Do not commit it to source control or expose it in
                client-side code. Regenerate it immediately if compromised.
              </p>
            </div>
          </section>

          {/* Base URL */}
          <section id="base-url">
            <h2 className="text-2xl font-bold text-white mb-6">Base URL</h2>
            <div className="rounded-lg bg-gray-950 border border-gray-800 p-4">
              <code className="text-sm font-mono text-emerald-400">
                https://polymarketsignals.com/api/v1
              </code>
            </div>
          </section>

          {/* Endpoints */}
          <section id="endpoints">
            <h2 className="text-2xl font-bold text-white mb-8">Endpoints</h2>

            {/* GET /signals */}
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-800 overflow-hidden">
                {/* Endpoint header */}
                <div className="flex items-center gap-3 px-5 py-4 bg-gray-900/60 border-b border-gray-800">
                  <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    GET
                  </span>
                  <code className="text-sm font-mono text-gray-200">/api/v1/signals</code>
                  <span className="ml-auto text-xs text-gray-500">Returns all asset signals</span>
                </div>

                <div className="p-5 space-y-5">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Returns the latest signals for all 5 assets (BTC, ETH, SOL, XRP, DOGE). Signals
                    are regenerated daily at 8:00 AM UTC. The same set is returned throughout the
                    trading day until the next generation cycle.
                  </p>

                  {/* Query params */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Query Parameters
                    </p>
                    <div className="rounded-lg border border-gray-800 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-900/60">
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Param</th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Type</th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          <tr>
                            <td className="px-4 py-3">
                              <code className="text-xs font-mono text-yellow-400">asset</code>
                              <span className="ml-2 text-xs text-gray-600">optional</span>
                            </td>
                            <td className="px-4 py-3 text-xs font-mono text-gray-500">string</td>
                            <td className="px-4 py-3 text-xs text-gray-400">
                              Filter by asset symbol. One of:{' '}
                              <code className="text-gray-300 font-mono">BTC</code>,{' '}
                              <code className="text-gray-300 font-mono">ETH</code>,{' '}
                              <code className="text-gray-300 font-mono">SOL</code>,{' '}
                              <code className="text-gray-300 font-mono">XRP</code>,{' '}
                              <code className="text-gray-300 font-mono">DOGE</code>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Example requests */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Example Requests
                    </p>
                    <div className="rounded-lg bg-gray-950 border border-gray-800 p-4 overflow-x-auto">
                      <p className="text-xs text-gray-600 font-mono mb-1"># All signals</p>
                      <code className="text-xs font-mono text-gray-300 whitespace-pre">
                        GET /api/v1/signals
                      </code>
                    </div>
                    <div className="rounded-lg bg-gray-950 border border-gray-800 p-4 overflow-x-auto">
                      <p className="text-xs text-gray-600 font-mono mb-1"># BTC only</p>
                      <code className="text-xs font-mono text-gray-300 whitespace-pre">
                        GET /api/v1/signals?asset=BTC
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Response Schema */}
          <section id="response-schema">
            <h2 className="text-2xl font-bold text-white mb-6">Response Schema</h2>
            <div className="rounded-xl border border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-gray-900/60 border-b border-gray-800">
                <span className="text-xs font-mono text-gray-400">application/json</span>
                <span className="text-xs text-gray-600">HTTP 200 OK</span>
              </div>
              <pre className="p-5 text-sm font-mono text-gray-300 overflow-x-auto bg-gray-950 leading-relaxed">
                {responseSchema}
              </pre>
            </div>

            {/* Field descriptions */}
            <div className="mt-6 rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-900/60 border-b border-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50 text-xs">
                  {[
                    { field: 'asset', type: 'string', desc: 'Asset symbol: BTC, ETH, SOL, XRP, or DOGE' },
                    { field: 'direction', type: 'string', desc: '"LONG" or "SHORT"' },
                    { field: 'confidence', type: 'number', desc: 'Model confidence score, 0.0–1.0' },
                    { field: 'entry_price', type: 'number', desc: 'Suggested entry price in USD' },
                    { field: 'stop_loss', type: 'number', desc: 'Stop loss level in USD' },
                    { field: 'take_profit', type: 'number', desc: 'Take profit target in USD' },
                    { field: 'timeframe', type: 'string', desc: 'Signal timeframe: "5m", "10m", or "15m"' },
                    { field: 'generated_at', type: 'string', desc: 'ISO 8601 UTC timestamp of signal generation' },
                  ].map((row) => (
                    <tr key={row.field} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <code className="font-mono text-yellow-400">{row.field}</code>
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-500">{row.type}</td>
                      <td className="px-4 py-3 text-gray-400">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits">
            <h2 className="text-2xl font-bold text-white mb-6">Rate Limits</h2>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">1,000 requests per day</p>
                  <p className="text-gray-500 text-sm">Resets at midnight UTC</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">
                Rate limit information is included in every API response via headers:
              </p>

              <div className="rounded-lg border border-gray-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900/60 border-b border-gray-800">
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Header</th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50 text-xs">
                    <tr>
                      <td className="px-4 py-3 font-mono text-yellow-400">X-RateLimit-Limit</td>
                      <td className="px-4 py-3 text-gray-400">Maximum requests allowed per day</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-yellow-400">X-RateLimit-Remaining</td>
                      <td className="px-4 py-3 text-gray-400">Requests remaining in current window</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-gray-500">
                Exceeding the rate limit returns{' '}
                <code className="text-red-400 font-mono text-xs">HTTP 429 Too Many Requests</code>.
              </p>
            </div>
          </section>

          {/* Code Examples */}
          <section id="code-examples">
            <h2 className="text-2xl font-bold text-white mb-6">Code Examples</h2>
            <DocsCodeTabs curlExample={curlExample} pythonExample={pythonExample} />
          </section>

          {/* Error codes */}
          <section id="errors">
            <h2 className="text-2xl font-bold text-white mb-6">Error Codes</h2>
            <div className="rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-900/60 border-b border-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50 text-xs">
                  {[
                    { status: '200 OK', color: 'text-emerald-400', desc: 'Request successful' },
                    { status: '401 Unauthorized', color: 'text-red-400', desc: 'Missing or invalid API key' },
                    { status: '403 Forbidden', color: 'text-red-400', desc: 'API key valid but subscription does not include API access' },
                    { status: '429 Too Many Requests', color: 'text-yellow-400', desc: 'Daily rate limit exceeded' },
                    { status: '500 Internal Server Error', color: 'text-red-400', desc: 'Server error — contact support if persistent' },
                  ].map((row) => (
                    <tr key={row.status} className="hover:bg-gray-800/20 transition-colors">
                      <td className={`px-4 py-3 font-mono font-semibold ${row.color}`}>{row.status}</td>
                      <td className="px-4 py-3 text-gray-400">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to build?</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              Get API access with the API plan at $99/mo. Includes 1,000 requests/day,
              all 5 asset signals, multi-timeframe data, and dedicated support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl border border-emerald-500 shadow-lg shadow-emerald-500/20 transition-all duration-150"
              >
                Get API Access
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/dashboard/api-key"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all duration-150"
              >
                Manage API Key
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
