import { setTimeout } from "node:timers/promises";

export async function waitForHealth(baseUrl: string) {
  const maxAttempts = 30;
  const interval = 100;
  const healthUrl = `${baseUrl}/api/health`;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(healthUrl);

      if (response.ok) {
        const data = await response.json();

        if (data.status === "ok") {
          return;
        }
      }
    } catch {}

    attempts++;
    await setTimeout(interval);
  }

  throw new Error(`Server health check failed after ${maxAttempts} attempts`);
}
