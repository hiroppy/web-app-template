import AxeBuilder from "@axe-core/playwright";
import { test as base } from "@playwright/test";
import type { User } from "next-auth";
import { truncate } from "../tests/db.setup";
import { generatePrismaClient } from "./helpers/prisma";
import { registerUserToDB } from "./helpers/users";
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
  registerToDB: (user: User) => Promise<void>;
  reset: () => Promise<void>;
  a11y: () => AxeBuilder;
};

// biome-ignore lint: lint/complexity/noBannedTypes
export type WorkerFixtures = {};

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
  registerToDB: async ({ page, reset }, use) => {
    await use(async (user: User) => {
      await registerUserToDB(user);
    });
    await reset();
  },
  reset: ({ context }, use) => {
    use(async () => {
      await using db = await generatePrismaClient();
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
