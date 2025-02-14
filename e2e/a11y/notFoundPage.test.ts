import { expect } from "@playwright/test";
import { test } from "../fixtures";

test.describe("NotFound Page", () => {
  test("should not have any automatically detectable accessibility issues", async ({
    notFoundPage,
    a11y,
  }) => {
    await notFoundPage.goTo();

    const res = await a11y().analyze();

    expect(res.violations).toEqual([]);
  });
});
