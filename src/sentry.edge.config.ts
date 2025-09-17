import * as Sentry from "@sentry/nextjs";
import { getConfig } from "./app/_clients/sentry";

const config = getConfig();

Sentry.init(config);
