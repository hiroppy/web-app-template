import { expect, type Locator, type Page } from "@playwright/test";
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

  async goTo() {
    return await this.page.goto("/404");
  }

  async expectUI() {
    await expect(this.textNotFoundLocator).toBeVisible();
    await expect(this.linkGoToHomeLocator).toBeVisible();
  }
}
