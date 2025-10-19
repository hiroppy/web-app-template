import AxeBuilder from "@axe-core/playwright";
import { test as base } from "@playwright/test";
import type { User } from "../src/app/_clients/betterAuth";
import { setupDB } from "../tests/db.setup";
import { setupApp } from "./helpers/app";
import { registerUserToDB } from "./helpers/users";
/* start: sample */
import { ItemPage } from "./models/ItemPage";
/* end: sample */
import { MePage } from "./models/MePage";
import { NotFoundPage } from "./models/NotFoundPage";
import { SignInPage } from "./models/SignInPage";
import { TopPage } from "./models/TopPage";

export type TestFixtures = {
  topPage: TopPage;
  /* start: sample */
  itemPage: ItemPage;
  /* end: sample */
  mePage: MePage;
  signInPage: SignInPage;
  notFoundPage: NotFoundPage;
  storageState: string;
  registerToDB: (user: User) => Promise<void>;
  reset: () => Promise<void>;
  a11y: () => AxeBuilder;
};

export type WorkerFixtures = {
  setup: Awaited<{
    prisma: Awaited<ReturnType<typeof setupDB>>["prisma"];
    appPort: number;
    baseURL: string;
    dbURL: string;
    truncate: () => Promise<void>;
  }>;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  topPage: ({ page }, use) => {
    use(new TopPage(page));
  },
  /* start: sample */
  itemPage: ({ page }, use) => {
    use(new ItemPage(page));
  },
  /* end: sample */
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
        appPort: appSetup.appPort,
        baseURL,
        dbURL: dbSetup.url,
        truncate: () => dbSetup.truncate(),
      });
    },
    {
      scope: "worker",
      auto: true,
    },
  ],
  registerToDB: async ({ reset, setup }, use) => {
    await use(async (user: User) => {
      await registerUserToDB(user, setup.dbURL);
    });
    await reset();
  },
  reset: ({ context, setup }, use) => {
    use(async () => {
      await Promise.all([setup.truncate(), context.clearCookies()]);
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
