import * as Sentry from "@sentry/nextjs";

type InitOptions = Parameters<typeof Sentry.init>[0];

export function getConfig(options: Partial<InitOptions> = {}): InitOptions {
  return {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    // debug: process.env.NODE_ENV === "development",
    enableLogs: true,
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    ignoreErrors: [],
    integrations: [
      Sentry.consoleLoggingIntegration({
        levels: ["log", "warn", "error"],
      }),
      Sentry.zodErrorsIntegration(),
    ],
    ...options,
  } as const;
}
