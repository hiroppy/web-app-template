import type { BrowserContext } from "@playwright/test";
import { truncate } from "../../dbSetup.test";
import { generatePrismaClient } from "./prisma";

export async function reset(context: BrowserContext) {
  await using db = await generatePrismaClient();

  await Promise.all([truncate(db.prisma), context.clearCookies()]);
}
