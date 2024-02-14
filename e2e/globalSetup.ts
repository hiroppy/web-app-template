import { resolve } from "node:path";
import { type FullConfig, chromium } from "@playwright/test";
import { prisma } from "../src/app/_clients/prisma";
import { EMAIL, IMAGE, NAME } from "./constants";

export default async function globalSetup(config: FullConfig) {
  const sessionToken = "session_token";

  await prisma.user.upsert({
    where: {
      email: EMAIL,
    },
    create: {
      name: NAME,
      image: IMAGE,
      email: EMAIL,
      sessions: {
        create: {
          expires: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ),
          sessionToken,
        },
      },
      accounts: {
        create: {
          type: "oauth",
          provider: "google",
          providerAccountId: "id",
          id_token: "id_token",
          access_token: "access_token",
          token_type: "Bearer",
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
        },
      },
    },
    update: {},
  });

  const browser = await chromium.launch();
  const browserContext = await browser.newContext();

  await browserContext.addCookies([
    {
      name: "next-auth.session-token",
      value: sessionToken,
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
  await browser.close();
}
