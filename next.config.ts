import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { config } from "./env";

config();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*?)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Document-Policy",
            value: "js-profiling",
          },
        ],
      },
    ];
  },
  /* start: sample */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  /* end: sample */
  typedRoutes: true,
  experimental: {
    authInterrupts: true,
    sri: {
      algorithm: "sha256",
    },
  },
  /* start: otel */
  serverExternalPackages: [
    "@prisma/instrumentation",
    "@opentelemetry/exporter-metrics-otlp-grpc",
    "@opentelemetry/exporter-trace-otlp-grpc",
    "@opentelemetry/instrumentation-http",
    "@opentelemetry/resources",
    "@opentelemetry/sdk-metrics",
    "@opentelemetry/sdk-node",
    "@opentelemetry/sdk-trace-base",
    "@opentelemetry/semantic-conventions",
    "@sentry/nextjs",
    "@sentry/profiling-node",
  ],
  /* end: otel */
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  disableLogger: true,
  reactComponentAnnotation: {
    enabled: true,
  },
});
