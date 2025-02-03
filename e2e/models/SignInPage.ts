import { type Locator, type Page, expect } from "@playwright/test";
import { Base } from "./Base";

export class SignInPage extends Base {
  buttonSignInWithGoogleLocator: Locator;

  constructor(page: Page) {
    super(page);

    this.buttonSignInWithGoogleLocator = this.page.locator(
      'text="Sign in with Google"',
    );
  }

  async goTo() {
    return await this.page.goto("/signin");
  }

  async expectUI() {
    await expect(this.buttonSignInWithGoogleLocator).toBeVisible();
  }
}
