import { user1 } from "../dummyUsers";
import { test } from "../fixtures";
import { useUser } from "../helpers/users";

test.describe("user1", () => {
  useUser(test, user1.id);

  test.beforeEach(async ({ registerToDB, topPage, mePage }) => {
    await registerToDB(user1);

    await topPage.goTo();
    await mePage.goToMePage();

    await mePage.expectHeaderUI("signIn", user1);
    await mePage.expectUI(user1.name);
  });

  test("should change user name", async ({ mePage, topPage }) => {
    const newName = "new-name";

    await mePage.expectUI(user1.name);
    await mePage.changeName(newName);
    await topPage.expectUI("signIn", {
      ...user1,
      name: newName,
    });

    await mePage.goToMePage();
    await mePage.expectUI(newName);
  });
});
