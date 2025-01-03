import { user1 } from "../dummyUsers";
import { expect, test } from "../fixtures";
import { reset } from "../helpers/reset";
import { registerUserToDB, useUser } from "../helpers/users";
import { TopPage } from "../models/TopPage";

test.afterEach(async ({ context }) => {
  await reset(context);
});

test.describe("user1", () => {
  useUser(test, user1);

  test.beforeEach(async ({ page }) => {
    await registerUserToDB(user1);

    const topPage = new TopPage(page);

    await topPage.goTo();
  });

  test("should create an item and then delete all items", async ({ page }) => {
    const topPage = new TopPage(page);

    await topPage.expectHeaderUI("signIn", user1);
    await topPage.expectUI("signIn", user1);

    await topPage.addItem("hello!");

    expect(await topPage.getItems()).toMatchObject([
      {
        img: user1.image,
        title: "hello!",
      },
    ]);

    await topPage.deleteAllItems();

    expect(await topPage.getItems()).toMatchObject([]);
  });
});

test.describe("no signed in", () => {
  test.beforeEach(async ({ page }) => {
    const topPage = new TopPage(page);

    await topPage.goTo();
  });

  test("should hide all UI related to sign in", async ({ page }) => {
    const topPage = new TopPage(page);

    await topPage.expectHeaderUI("signOut", user1);
    await topPage.expectUI("signOut");
  });
});
