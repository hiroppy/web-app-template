import type { NextConfig } from "next";
import { config } from "./env";

config();

const nextConfig: NextConfig = {
  /* start: sample */
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
  },
  /* end: sample */
  /* start: otel */
  webpack: (config, { isServer }) => {
    if (isServer) {
      // https://github.com/open-telemetry/opentelemetry-js/issues/4173
      config.ignoreWarnings = [{ module: /opentelemetry/ }];
    }
    return config;
  },
  /* end: otel */
};

export default nextConfig;
