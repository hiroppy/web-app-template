import { exec } from "node:child_process";
import AxeBuilder from "@axe-core/playwright";
import { test as base } from "@playwright/test";
import type { User } from "next-auth";
import { truncate } from "../tests/db.setup";
import { setupDB } from "../tests/db.setup";
import { setupApp } from "./helpers/app";
import { getRandomPort } from "./helpers/getRandomPort";
import { generatePrismaClient } from "./helpers/prisma";
import { registerUserToDB } from "./helpers/users";
import { waitForHealth } from "./helpers/waitForHealth";
import { MePage } from "./models/MePage";
import { NotFoundPage } from "./models/NotFoundPage";
import { SignInPage } from "./models/SignInPage";
import { TopPage } from "./models/TopPage";

export type TestFixtures = {
  topPage: TopPage;
  mePage: MePage;
  signInPage: SignInPage;
  notFoundPage: NotFoundPage;
  storageState: string;
  registerUserToDB: (user: User) => Promise<void>;
  reset: () => Promise<void>;
  a11y: () => AxeBuilder;
};

export type WorkerFixtures = {
  setup: Awaited<{
    prisma: Awaited<ReturnType<typeof setupDB>>["prisma"];
    appPort: number;
    baseURL: string;
    dbURL: string;
  }>;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  topPage: ({ page }, use) => {
    use(new TopPage(page));
  },
  mePage: ({ page }, use) => {
    use(new MePage(page));
  },
  signInPage: ({ page }, use) => {
    use(new SignInPage(page));
  },
  notFoundPage: ({ page }, use) => {
    use(new NotFoundPage(page));
  },
  setup: [
    async ({ browser }, use) => {
      const appPort = await getRandomPort();
      await using dbSetup = await setupDB({ port: "random" });
      await using appSetup = await setupApp(dbSetup.port);
      const baseURL = appSetup.baseURL;

      const originalNewContext = browser.newContext.bind(browser);

      // rewrite newContext to include baseURL
      browser.newContext = async () => {
        return originalNewContext({
          baseURL,
        });
      };

      await use({
        prisma: dbSetup.prisma,
        appPort,
        baseURL,
        dbURL: dbSetup.url,
      });
    },
    {
      scope: "worker",
      auto: true,
    },
  ],
  registerUserToDB: async ({ reset, setup }, use) => {
    await use(async (user: User) => {
      await registerUserToDB(user, setup.dbURL);
    });
    await reset();
  },
  reset: ({ context, setup }, use) => {
    use(async () => {
      await using db = await generatePrismaClient(setup.dbURL);
      await Promise.all([truncate(db.prisma), context.clearCookies()]);
    });
  },
  a11y: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        // global disabled rules
        .disableRules(["meta-viewport"]);

    await use(makeAxeBuilder);
  },
});
