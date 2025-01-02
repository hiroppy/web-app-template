import { resolve } from "node:path";
import type { Browser } from "@playwright/test";
import { user1 } from "../mockedUsers";
import { generatePrismaClient } from "./prisma";

export async function createUser(browser: Browser, user = user1) {
  await using db = await generatePrismaClient();
  const userData = {
    ...user,
    accounts: {
      create: {
        type: "oauth",
        provider: "google",
        providerAccountId: user.id ?? "id",
        id_token: "id_token",
        access_token: "access_token",
        token_type: "Bearer",
        scope: "scope",
      },
    },
  };

  await db.prisma.user.upsert({
    where: {
      id: user.id,
    },
    create: userData,
    update: userData,
  });

  const browserContext = await browser.newContext();

  await browserContext.addCookies([
    {
      name: "authjs.session-token",
      value: btoa(
        JSON.stringify({
          ...user,
          // google provides picture, not the image key
          picture: user.image,
        }),
      ),
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      expires: Math.round((Date.now() + 60 * 60 * 24 * 1000 * 7) / 1000),
    },
  ]);

  await browserContext.storageState({
    path: resolve(__dirname, "storageState.json"),
  });
}
