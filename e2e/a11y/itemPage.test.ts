import { expect } from "@playwright/test";
import { user1 } from "../dummyUsers";
import { test } from "../fixtures";
import { useUser } from "../helpers/users";

test.describe("Items Page", () => {
  useUser(test, user1);

  test("should not have any automatically detectable accessibility issues", async ({
    a11y,
    topPage,
    itemPage,
  }) => {
    const content = "foo";

    await topPage.goTo();
    await topPage.addItem(content);
    await topPage.clickItemByTitle(content);

    await itemPage.expectUI(content);

    const res = await a11y().analyze();

    expect(res.violations).toEqual([]);
  });
});
