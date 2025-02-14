import { expect } from "@playwright/test";
import { test } from "../fixtures";

test.describe("SignIn Page", () => {
  test("should not have any automatically detectable accessibility issues", async ({
    signInPage,
    a11y,
  }) => {
    await signInPage.goTo();

    const res = await a11y().analyze();

    expect(res.violations).toEqual([]);
  });
});
