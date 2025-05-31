import { expect } from "@playwright/test";
import { user1 } from "../dummyUsers";
import { test } from "../fixtures";
import { useUser } from "../helpers/users";

test.describe("Me Page", () => {
  useUser(test, user1);

  test("should not have any automatically detectable accessibility issues", async ({
    a11y,
    mePage,
  }) => {
    await mePage.goTo();

    const res = await a11y().analyze();

    expect(res.violations).toEqual([]);
  });
});
