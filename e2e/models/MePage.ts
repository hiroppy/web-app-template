import type { Locator, Page } from "@playwright/test";
import { expect } from "../fixtures";
import { Base } from "./Base";

export class MePage extends Base {
  nameInputLocator: Locator;
  submitButtonLocator: Locator;

  constructor(page: Page) {
    super(page);

    this.nameInputLocator = this.page.locator('input[name="name"]');
    this.submitButtonLocator = this.page.locator('button[type="submit"]');
  }

  async goTo() {
    await this.init();

    return await this.page.goto("/me");
  }

  async changeName(name: string) {
    await this.nameInputLocator.fill(name);
    await this.submitButtonLocator.click();
  }

  async expectUI() {
    await expect(this.nameInputLocator).toBeVisible();
    await expect(this.submitButtonLocator).toBeVisible();
  }
}
