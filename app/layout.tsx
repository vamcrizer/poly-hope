import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://polymarketsignals.com";

export const metadata: Metadata = {
  title: "Polymarket Signals — AI-Powered Crypto Prediction Signals",
  description:
    "Get AI-powered trading signals for Polymarket crypto prediction markets. BTC, ETH, SOL, XRP, DOGE signals with 89% accuracy. Updated daily at 8AM UTC.",
  keywords:
    "Polymarket, crypto signals, prediction markets, BTC signals, ETH signals, trading signals, AI trading",
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Polymarket Signals — AI-Powered Crypto Prediction Signals",
    description:
      "Get AI-powered trading signals for Polymarket crypto prediction markets. 89% accuracy. Updated daily.",
    type: "website",
    siteName: "Polymarket Signals",
    url: APP_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Polymarket Signals — AI-Powered Crypto Prediction Signals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Polymarket Signals — AI-Powered Crypto Prediction Signals",
    description:
      "AI-powered signals for Polymarket crypto traders. BTC, ETH, SOL, XRP, DOGE. Updated daily.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Polymarket Signals",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "description": "AI-powered trading signals for Polymarket prediction markets. BTC, ETH, SOL, XRP, DOGE signals updated daily.",
  "url": APP_URL,
  "offers": [
    { "@type": "Offer", "name": "Basic", "price": "19", "priceCurrency": "USD", "billingIncrement": "P1M" },
    { "@type": "Offer", "name": "Pro", "price": "39", "priceCurrency": "USD", "billingIncrement": "P1M" },
    { "@type": "Offer", "name": "API", "price": "99", "priceCurrency": "USD", "billingIncrement": "P1M" },
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "47",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0f" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full antialiased bg-[#0a0a0f] text-gray-100">
        {children}
      </body>
    </html>
  );
}
