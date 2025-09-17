"use client";

import * as Sentry from "@sentry/nextjs";
import { type PropsWithChildren, useEffect } from "react";

type Props = PropsWithChildren;

export function SentryProvider({ children }: Props) {
  useEffect(() => {
    (async () => {
      try {
        await Sentry.diagnoseSdkConnectivity();
      } catch {
        // ignore
      }
    })();
  }, []);

  return <>{children}</>;
}
