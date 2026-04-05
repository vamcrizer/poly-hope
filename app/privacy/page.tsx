import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Polymarket Signals',
  description:
    'Privacy Policy for Polymarket Signals. Learn how we collect, use, and protect your data.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  const lastUpdated = 'April 1, 2026';

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-gray-800/60 border border-gray-700 rounded-full px-3 py-1 text-gray-400 text-xs font-medium mb-5">
              Legal
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-sm">
              Last updated: <time dateTime="2026-04">{lastUpdated}</time>. Questions?{' '}
              <a
                href="mailto:support@polymarketsignals.com"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                support@polymarketsignals.com
              </a>
            </p>
          </div>

          {/* TL;DR */}
          <div className="mb-10 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-sm font-semibold text-emerald-400 mb-2">The short version</p>
            <ul className="space-y-1 text-gray-400 text-sm">
              <li>We collect your email and subscription status — nothing else.</li>
              <li>Payments go through Stripe; we never see your card details.</li>
              <li>We never sell your data. Ever.</li>
              <li>No analytics trackers, no ad pixels, no third-party scripts.</li>
              <li>Delete your account anytime by emailing us.</li>
            </ul>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {/* 1 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. What We Collect</h2>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>We collect only the minimum data necessary to provide the Service:</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                    <span>
                      <strong className="text-gray-200">Email address</strong> — used to create your
                      account, send daily signal digests, and send transactional emails (billing
                      receipts, password resets, service notices).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                    <span>
                      <strong className="text-gray-200">Subscription status</strong> — your current
                      plan (Basic, Pro, or API) and billing status, stored to control access to features.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                    <span>
                      <strong className="text-gray-200">API key</strong> — a generated token for
                      API-tier subscribers. We store a hashed version and never expose the raw key
                      after initial generation.
                    </span>
                  </li>
                </ul>
                <p className="mt-3">
                  We do <strong className="text-white">not</strong> collect your name, address, phone
                  number, IP address logs, or any other personal data beyond the above.
                </p>
              </div>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Payment Processing</h2>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  All payments are processed by{' '}
                  <a
                    href="https://stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Stripe
                  </a>
                  , a PCI-DSS Level 1 certified payment processor. We never see, receive, or store
                  your credit card number, CVV, or full billing address. Stripe handles all payment
                  data directly.
                </p>
                <p className="mt-3">
                  We store your Stripe customer ID to manage your subscription and process refunds.
                  This ID is opaque and does not expose any payment details.
                </p>
              </div>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. How We Use Your Data</h2>
              <div className="text-gray-400 text-sm leading-relaxed">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                    <span>To authenticate your account and control access to paid features.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                    <span>
                      To send daily signal digest emails via SMTP at 8AM UTC — the core service
                      delivery.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                    <span>
                      To send transactional emails: billing confirmations, subscription change
                      notices, and service alerts.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 mt-0.5 shrink-0">•</span>
                    <span>
                      We do <strong className="text-white">not</strong> send marketing emails or
                      promotional campaigns without your explicit opt-in consent.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Data Sharing &amp; Sale</h2>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  We <strong className="text-white">never sell, rent, or trade your personal data</strong>{' '}
                  to third parties for any purpose.
                </p>
                <p className="mt-3">
                  We share data only with the service providers necessary to operate Polymarket
                  Signals: Stripe (payments) and our transactional email provider. Both are bound by
                  data processing agreements consistent with applicable privacy regulations.
                </p>
                <p className="mt-3">
                  We may disclose data if required by law, court order, or to protect the rights and
                  safety of our users.
                </p>
              </div>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Cookies &amp; Analytics</h2>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  We use only essential session cookies to keep you logged in to the dashboard. These
                  cookies are strictly necessary for the Service to function.
                </p>
                <p className="mt-3">
                  We run <strong className="text-white">no third-party analytics</strong>. We do not
                  use Google Analytics, Mixpanel, ad pixels, or any tracking scripts. Your browsing
                  behaviour on our site is not tracked or shared.
                </p>
              </div>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Data Retention</h2>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  We retain your account data for as long as your account is active. If you cancel
                  your subscription, your data is retained for 90 days before deletion to allow for
                  billing dispute resolution. After 90 days, your email, subscription status, and
                  associated data are permanently deleted.
                </p>
              </div>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Account Deletion</h2>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  You may request complete deletion of your account and all associated data at any
                  time by emailing{' '}
                  <a
                    href="mailto:support@polymarketsignals.com"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    support@polymarketsignals.com
                  </a>{' '}
                  with the subject line &ldquo;Delete My Account&rdquo;. We will process deletion
                  requests within 30 days.
                </p>
              </div>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Security</h2>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  We use TLS encryption in transit, encrypted storage for sensitive fields, and
                  hashed passwords. Access to production data is restricted to authorised personnel
                  only. Despite these measures, no system is completely secure — please use a strong,
                  unique password for your account.
                </p>
              </div>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Changes to This Policy</h2>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of material
                  changes via email before they take effect. Your continued use of the Service after an
                  update constitutes acceptance of the revised Policy.
                </p>
              </div>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">10. Contact</h2>
              <div className="text-gray-400 text-sm leading-relaxed">
                <p>
                  Privacy questions, data requests, or deletion requests:{' '}
                  <a
                    href="mailto:support@polymarketsignals.com"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    support@polymarketsignals.com
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Footer links */}
          <div className="mt-14 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/terms"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Terms of Service &rarr;
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
