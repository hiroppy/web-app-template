import { user1 } from "../dummyUsers";
import { test } from "../fixtures";
import { useUser } from "../helpers/users";

test.describe("item", () => {
  useUser(test, user1);

  test.beforeEach(async ({ topPage }) => {
    await topPage.goTo();
    await topPage.expectHeaderUI("signIn", user1);
    await topPage.expectUI("signIn", user1);
    // Wait for database cleanup to complete before checking items
    await topPage.page.waitForLoadState("networkidle");
    await topPage.expectItems([]);
  });

  test("should create an item and then delete all items", async ({
    topPage,
  }) => {
    await topPage.addItem("hello!");
    await topPage.addItem("hello2!");
    await topPage.expectItems([
      {
        img: user1.image,
        title: "hello2!",
      },
      {
        img: user1.image,
        title: "hello!",
      },
    ]);

    await topPage.deleteAllItems();
    await topPage.expectItems([]);
  });

  test("should navigate to item detail page and display content", async ({
    topPage,
    itemPage,
  }) => {
    await topPage.addItem("hello world!");
    await topPage.expectItems([
      {
        img: user1.image,
        title: "hello world!",
      },
    ]);

    await topPage.clickItemByTitle("hello world!");
    await itemPage.expectUI("hello world!");
  });

  test("should handle non-existent item", async ({
    itemPage,
    notFoundPage,
  }) => {
    await itemPage.goTo("non-existent-id");
    await notFoundPage.expectUI();
  });
});
