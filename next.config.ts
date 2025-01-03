import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    authInterrupts: true,
    serverComponentsExternalPackages: [
      // https://github.com/open-telemetry/opentelemetry-js/issues/4173
      "@sentry/node",
      "@opentelemetry/instrumentation",
    ],
  },
};

export default nextConfig;
