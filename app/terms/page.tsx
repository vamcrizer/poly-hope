import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Polymarket Signals',
  description:
    'Terms of Service for Polymarket Signals. Read our subscription terms, refund policy, and legal disclaimers.',
  robots: { index: true, follow: true },
};

interface Section {
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    title: '1. Service Description',
    content: (
      <>
        <p>
          Polymarket Signals (&ldquo;Service&rdquo;) provides AI-generated directional trading signals for
          crypto prediction markets on Polymarket. Signals include asset direction (LONG/SHORT),
          confidence score, entry price, stop loss, and take profit levels, delivered via email and
          a web dashboard.
        </p>
        <p className="mt-3">
          Signals are generated algorithmically from market data using technical indicators
          (RSI, MACD, Bollinger Bands). They are updated daily at 8AM UTC for BTC, ETH, SOL, XRP,
          and DOGE. Pro and API subscribers additionally receive multi-timeframe signals.
        </p>
      </>
    ),
  },
  {
    title: '2. Subscription Terms',
    content: (
      <>
        <p>
          Subscriptions are billed monthly and auto-renew until cancelled. Three plans are available:
          Basic ($19/mo), Pro ($39/mo), and API ($99/mo). All plans include a 7-day free trial —
          no charge is made until the trial ends.
        </p>
        <p className="mt-3">
          You may cancel at any time from your account dashboard. Cancellation takes effect at the
          end of the current billing period. You will retain full access until then. We do not
          charge cancellation fees.
        </p>
        <p className="mt-3">
          We reserve the right to modify pricing with 30 days&rsquo; notice to existing subscribers.
          Your rate is locked for the current billing cycle in which notice is given.
        </p>
      </>
    ),
  },
  {
    title: '3. Refund Policy',
    content: (
      <p>
        We offer a <strong className="text-white">7-day money-back guarantee</strong> on all paid
        plans. If you are not satisfied within 7 days of your first charge, contact us at{' '}
        <a
          href="mailto:support@polymarketsignals.com"
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          support@polymarketsignals.com
        </a>{' '}
        and we will issue a full refund, no questions asked. Refund requests after 7 days are
        handled case-by-case and are not guaranteed. Refunds are processed within 5–10 business days
        depending on your payment method.
      </p>
    ),
  },
  {
    title: '4. No Financial Advice',
    content: (
      <>
        <p>
          All signals, content, and communications provided by Polymarket Signals are for
          <strong className="text-white"> informational purposes only</strong>. Nothing on this
          platform constitutes financial advice, investment advice, trading advice, or any other type
          of professional advice.
        </p>
        <p className="mt-3">
          Trading prediction markets and cryptocurrencies involves substantial risk of loss. Past
          signal accuracy (including any backtested performance statistics) does not guarantee future
          results. You should consult a qualified financial advisor before making investment decisions.
          You trade at your own risk.
        </p>
      </>
    ),
  },
  {
    title: '5. Acceptable Use',
    content: (
      <>
        <p>
          Your subscription is for personal or internal business use only. You may not resell,
          redistribute, or share signal content publicly (e.g., publishing signals on social media,
          Telegram channels, or third-party platforms) without written permission.
        </p>
        <p className="mt-3">
          API subscribers may use the API for automated trading systems within their own
          infrastructure. The API rate limit (1,000 requests/day) applies. Exceeding limits or
          attempting to scrape the service without an API subscription may result in account
          suspension.
        </p>
      </>
    ),
  },
  {
    title: '6. Service Availability',
    content: (
      <p>
        We target 99% uptime for signal delivery and the web dashboard, but do not guarantee
        uninterrupted service. Signal delivery may be delayed due to data provider outages, market
        closures, or maintenance. We will notify subscribers by email of planned downtime exceeding
        one hour. API subscribers on the $99/mo plan are covered by a best-effort SLA — contact
        support for details.
      </p>
    ),
  },
  {
    title: '7. Limitation of Liability',
    content: (
      <p>
        To the maximum extent permitted by applicable law, Polymarket Signals and its operators
        shall not be liable for any direct, indirect, incidental, special, or consequential damages
        arising from your use of the Service, including but not limited to trading losses, missed
        opportunities, or signal inaccuracies. Our total liability to you for any claim shall not
        exceed the amount you paid us in the three months preceding the claim.
      </p>
    ),
  },
  {
    title: '8. Termination',
    content: (
      <p>
        We reserve the right to suspend or terminate accounts that violate these Terms, engage in
        abuse, or attempt to circumvent payment. In cases of termination for violation, no refund
        will be issued. If we terminate your account without cause, we will refund any unused
        prepaid subscription period.
      </p>
    ),
  },
  {
    title: '9. Changes to Terms',
    content: (
      <p>
        We may update these Terms from time to time. Material changes will be emailed to subscribers
        with at least 14 days&rsquo; notice. Continued use of the Service after the effective date
        constitutes acceptance of the updated Terms.
      </p>
    ),
  },
  {
    title: '10. Governing Law',
    content: (
      <p>
        These Terms are governed by the laws of Singapore. Any disputes shall be resolved in the
        courts of Singapore. If you are a consumer in a jurisdiction with mandatory local consumer
        protection laws, those laws may additionally apply.
      </p>
    ),
  },
];

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-gray-500 text-sm">
              Last updated: {lastUpdated}. Questions?{' '}
              <a
                href="mailto:support@polymarketsignals.com"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                support@polymarketsignals.com
              </a>
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-white mb-3">
                  {section.title}
                </h2>
                <div className="text-gray-400 text-sm leading-relaxed">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Footer links */}
          <div className="mt-14 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Privacy Policy →
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
