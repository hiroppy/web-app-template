// TODO: update

import { expect, test } from "../fixtures";
import { createUser } from "../helpers/createUser";
import { reset } from "../helpers/reset";
import { user1 } from "../mockedUsers";
import { TopPage } from "../models/TopPage";

test.beforeEach(async ({ browser, page }) => {
  await createUser(browser);

  const topPage = new TopPage(page);

  await topPage.init();
  await topPage.goTo();
});

test.afterEach(async ({ context }) => {
  await reset(context);
});

test("should create an item and then delete all items", async ({ page }) => {
  await page.reload();
  const topPage = new TopPage(page);

  await topPage.expectHeaderUI("signIn", user1);
  await topPage.expectUI("signIn");

  await topPage.addItem("hello!");

  await topPage.deleteAllItems();

  expect(await topPage.getItems()).toMatchObject([]);
});
