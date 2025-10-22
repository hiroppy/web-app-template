import * as Sentry from "@sentry/nextjs";
import { getConfig } from "./app/_clients/sentry";

const config = getConfig({
  replaysSessionSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,
  profilesSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.reportingObserverIntegration(),
    // Sentry.thirdPartyErrorFilterIntegration({
    //   filterKeys: [applicationKey],
    //   behaviour: "drop-error-if-contains-third-party-frames",
    // }),
  ],
});

Sentry.init(config);

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
