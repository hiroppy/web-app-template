import type { Locator, Page } from "@playwright/test";
import { expect } from "../fixtures";
import { Base } from "./Base";

export class SignInPage extends Base {
  signInWithGoogleLocator: Locator;

  constructor(page: Page) {
    super(page);

    this.signInWithGoogleLocator = this.page.locator(
      'text="Sign in with Google"',
    );
  }

  async expectUI() {
    await expect(this.signInWithGoogleLocator).toBeVisible();
  }
}
