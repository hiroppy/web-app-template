import { resolve } from "node:path";
import { type FullConfig, chromium } from "@playwright/test";
import { setupDB } from "../dbSetup.test";
import { EMAIL, IMAGE, NAME } from "./constants";

export default async function globalSetup(config: FullConfig) {
  const { container, prisma } = await setupDB();

  // @ts-expect-error Store the container reference for later teardown
  global.__DB_CONTAINER__ = container;

  const jwt = {
    id: "id",
    name: NAME,
    email: EMAIL,
    image: IMAGE,
    role: "user",
  };

  const userData = {
    ...jwt,
    accounts: {
      create: {
        type: "oauth",
        provider: "google",
        providerAccountId: "id",
        id_token: "id_token",
        access_token: "access_token",
        token_type: "Bearer",
        scope: "scope",
      },
    },
  };

  await prisma.user.upsert({
    where: {
      email: EMAIL,
    },
    create: userData,
    update: userData,
  });

  const browser = await chromium.launch();
  const browserContext = await browser.newContext();

  await browserContext.addCookies([
    {
      name: "authjs.session-token",
      value: btoa(
        JSON.stringify({
          ...jwt,
          // google provides picture, not image
          picture: IMAGE,
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
  await browser.close();
}
