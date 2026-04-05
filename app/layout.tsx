import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Polymarket Signals — AI-Powered Crypto Prediction Signals",
  description:
    "Get AI-powered trading signals for Polymarket crypto prediction markets. BTC, ETH, SOL, XRP, DOGE signals with 89% accuracy. Updated daily at 8AM UTC.",
  keywords:
    "Polymarket, crypto signals, prediction markets, BTC signals, ETH signals, trading signals, AI trading",
  openGraph: {
    title: "Polymarket Signals — AI-Powered Crypto Prediction Signals",
    description:
      "Get AI-powered trading signals for Polymarket crypto prediction markets. 89% accuracy. Updated daily.",
    type: "website",
    siteName: "Polymarket Signals",
  },
  twitter: {
    card: "summary_large_image",
    title: "Polymarket Signals — AI-Powered Crypto Prediction Signals",
    description:
      "AI-powered signals for Polymarket crypto traders. BTC, ETH, SOL, XRP, DOGE. Updated daily.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
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
      </head>
      <body className="min-h-full antialiased bg-[#0a0a0f] text-gray-100">
        {children}
      </body>
    </html>
  );
}
