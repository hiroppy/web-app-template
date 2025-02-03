import { user1 } from "../dummyUsers";
import { test } from "../fixtures";
import { useUser } from "../helpers/users";

test.describe("no sign in", () => {
  test("should redirect to signIn page when accessing /me page", async ({
    mePage,
    signInPage,
  }) => {
    await mePage.goTo();

    await mePage.expectHeaderUI("signOut");
    await signInPage.expectUI();
  });
});

test.describe("sign in", () => {
  useUser(test, user1.id);

  test.beforeEach(async ({ registerToDB, topPage }) => {
    await registerToDB(user1);

    await topPage.goTo();
    await topPage.expectUI("signIn", user1);
    await topPage.expectHeaderUI("signIn", user1);
  });

  test("should go to /me page", async ({ mePage }) => {
    await mePage.goToMePage();

    await mePage.expectHeaderUI("signIn", user1);
    await mePage.expectUI(user1.name);
  });
});
