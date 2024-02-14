import { expect, test } from "@playwright/test";
import { IMAGE } from "../constants";
import { TopPage } from "../models/TopPage";

test.beforeEach(async ({ page }) => {
  const topPage = new TopPage(page);

  await topPage.init();
  await topPage.goTo();
});

test("should create an item and then delete all items", async ({ page }) => {
  const topPage = new TopPage(page);

  await topPage.expectHeaderUI("signIn");
  await topPage.expectUI("signIn");

  await topPage.addItem("hello!");

  expect(await topPage.getItems()).toMatchObject([
    {
      img: IMAGE,
      title: "hello!",
    },
  ]);

  await topPage.deleteAllItems();

  expect(await topPage.getItems()).toMatchObject([]);
});

test("should hide all UI related to sign in", async ({ page, context }) => {
  await context.clearCookies();
  await page.reload();

  const topPage = new TopPage(page);

  await topPage.expectHeaderUI("signOut");
  await topPage.expectUI("signOut");
});
