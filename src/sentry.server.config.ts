import * as Sentry from "@sentry/nextjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { getConfig } from "./app/_clients/sentry";
import { instrumentations } from "./otel/instrumentations";

const config = getConfig({
  profileLifecycle: "trace",
  profileSessionSampleRate: 0.1,
  integrations: [nodeProfilingIntegration()],
  openTelemetryInstrumentations: instrumentations,
});

Sentry.init(config);
