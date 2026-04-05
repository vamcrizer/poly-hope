import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Stripe webhook needs raw body
  async headers() {
    return [
      {
        source: "/api/stripe/webhook",
        headers: [{ key: "content-type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
