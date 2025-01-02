import type { FullConfig } from "@playwright/test";
import { setupDB } from "../dbSetup.test";

export default async function globalSetup(config: FullConfig) {
  const { down } = await setupDB({
    port: Number(process.env.POSTGRES_PORT),
  });

  global.down = down;
}
