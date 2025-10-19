import { exec } from "node:child_process";
import { getRandomPort } from "./getRandomPort";
import { waitForHealth } from "./waitForHealth";

export async function setupApp(dbPort: number) {
  const appPort = await getRandomPort();
  const baseURL = `http://localhost:${appPort}`;
  const cp = exec(
    `BETTER_AUTH_URL=${baseURL} DATABASE_PORT=${dbPort} pnpm start --port ${appPort}`,
  );
  await waitForHealth(baseURL);

  return {
    appPort,
    baseURL,
    async [Symbol.asyncDispose]() {
      if (cp.pid) {
        process.kill(cp.pid);
      }
    },
  };
}
