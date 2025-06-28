import { expect, type Locator, type Page } from "@playwright/test";
import { Base } from "./Base";

export class SignInPage extends Base {
  buttonSignInWithGoogleLocator: Locator;

  constructor(page: Page) {
    super(page);

    this.buttonSignInWithGoogleLocator = this.page.getByRole("button", {
      name: "Sign in with Google",
    });
  }

  async goTo() {
    return await this.page.goto("/signin");
  }

  async expectUI() {
    await expect(this.buttonSignInWithGoogleLocator).toBeVisible();
  }
}
