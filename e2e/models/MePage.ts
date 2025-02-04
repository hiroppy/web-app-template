import { type Locator, type Page, expect } from "@playwright/test";
import { Base } from "./Base";

export class MePage extends Base {
  inputNameLocator: Locator;
  buttonSubmitLocator: Locator;

  constructor(page: Page) {
    super(page);

    this.inputNameLocator = this.page.locator('input[name="name"]');
    this.buttonSubmitLocator = this.page.locator('button[type="submit"]');
  }

  async goTo() {
    return await this.page.goto("/me");
  }

  async changeName(name: string) {
    await this.inputNameLocator.fill(name);
    await this.buttonSubmitLocator.click();
  }

  async expectUI(name: string) {
    await expect(this.inputNameLocator).toBeVisible();
    await expect(this.buttonSubmitLocator).toBeVisible();
    await expect(this.inputNameLocator).toHaveValue(name);
  }
}
