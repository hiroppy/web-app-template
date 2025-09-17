"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "./_components/Button";
import { Container } from "./_components/Container";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <Container>
          <h2>Something went wrong!</h2>
          <Button onClick={() => reset()}>Try again</Button>
        </Container>
      </body>
    </html>
  );
}
