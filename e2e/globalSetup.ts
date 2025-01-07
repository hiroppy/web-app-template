import type { FullConfig } from "@playwright/test";
import { setupDB } from "../tests/db.setup";

export default async function globalSetup(config: FullConfig) {
  const { down } = await setupDB({
    port: Number(process.env.DATABASE_PORT),
  });

  global.down = down;
}
