import { expect } from "@playwright/test";
import { user1 } from "../dummyUsers";
import { test } from "../fixtures";
import { useUser } from "../helpers/users";

test.describe("Top Page", () => {
  test.describe("not signed in", () => {
    test("should not have any automatically detectable accessibility issues", async ({
      topPage,
      a11y,
    }) => {
      await topPage.goTo();

      const res = await a11y().analyze();

      expect(res.violations).toEqual([]);
    });
  });

  test.describe("signed in", () => {
    useUser(test, user1);

    test("should not have any automatically detectable accessibility issues", async ({
      topPage,
      a11y,
    }) => {
      await topPage.goTo();

      /* start: sample */
      await topPage.addItem("foo");
      await topPage.addItem("bar");
      /* end: sample */

      const res = await a11y().analyze();

      expect(res.violations).toEqual([]);
    });
  });
});
