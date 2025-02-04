import { type Locator, type Page, expect } from "@playwright/test";
import { Base } from "./Base";

export class NotFoundPage extends Base {
  textNotFoundLocator: Locator;
  linkGoToHomeLocator: Locator;

  constructor(page: Page) {
    super(page);

    this.textNotFoundLocator = this.page.locator("span", {
      hasText: "Not Found",
    });
    this.linkGoToHomeLocator = this.page.locator("a", {
      hasText: "Go to Home",
    });
  }

  async expectUI() {
    await expect(this.textNotFoundLocator).toBeVisible();
    await expect(this.linkGoToHomeLocator).toBeVisible();
  }
}
