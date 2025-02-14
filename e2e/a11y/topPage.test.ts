import { expect } from "@playwright/test";
import { test } from "../fixtures";

test.describe("Top Page", () => {
  test("should not have any automatically detectable accessibility issues", async ({
    topPage,
    a11y,
  }) => {
    await topPage.goTo();

    const res = await a11y().analyze();

    expect(res.violations).toEqual([]);
  });
});
