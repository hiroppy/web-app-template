/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // https://github.com/open-telemetry/opentelemetry-js/issues/4173
      config.ignoreWarnings = [{ module: /opentelemetry/ }];
    }
    return config;
  },
};

export default nextConfig;
