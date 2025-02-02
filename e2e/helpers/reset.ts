import type { BrowserContext } from "@playwright/test";
import { truncate } from "../../tests/db.setup";
import { generatePrismaClient } from "./prisma";

export async function reset(context: BrowserContext) {
  await using db = await generatePrismaClient();

  await Promise.all([truncate(db.prisma), context.clearCookies()]);
}
