import { expect, type Locator, type Page } from "@playwright/test";
import { Base } from "./Base";

export class ItemPage extends Base {
  titleLocator: Locator;
  contentLocator: Locator;
  createdAtLocator: Locator;

  constructor(page: Page) {
    super(page);

    this.titleLocator = this.page.getByRole("heading", {
      name: "Item Detail",
    });
    this.contentLocator = this.page.locator("div.space-y-5 > p");
    this.createdAtLocator = this.page.locator("time");
  }

  async goTo(itemId: string) {
    return await this.page.goto(`/items/${itemId}`);
  }

  async expectUI(expectedContent: string, expectedCreatedAt?: string) {
    await expect(this.titleLocator).toBeVisible();
    await expect(this.contentLocator).toHaveText(expectedContent);
    await expect(this.createdAtLocator).toBeVisible();

    if (expectedCreatedAt) {
      await expect(this.createdAtLocator).toContainText(expectedCreatedAt);
    }
  }
}
