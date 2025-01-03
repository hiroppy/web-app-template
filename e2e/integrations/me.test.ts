import { user1 } from "../dummyUsers";
import { test } from "../fixtures";
import { reset } from "../helpers/reset";
import { registerUserToDB, useUser } from "../helpers/users";
import { MePage } from "../models/MePage";
import { SignInPage } from "../models/SignInPage";
import { TopPage } from "../models/TopPage";

test.afterEach(async ({ context }) => {
  await reset(context);
});

test.describe("user1", () => {
  useUser(test, user1);

  test.beforeEach(async ({ page }) => {
    await registerUserToDB(user1);

    const mePage = new MePage(page);

    await mePage.goTo();
  });

  test("should change user name", async ({ page }) => {
    const newName = "new-name";
    const mePage = new MePage(page);

    await mePage.expectUI();
    await mePage.changeName(newName);

    const topPage = new TopPage(page);

    topPage.goTo();

    await topPage.expectUI("signIn", { ...user1, name: newName });
  });
});

test.describe("no signed in", () => {
  test.beforeEach(async ({ page }) => {
    const mePage = new MePage(page);

    await mePage.goTo();
  });

  test("should go to signIn page", async ({ page }) => {
    const signInPage = new SignInPage(page);

    await signInPage.expectUI();
  });
});
