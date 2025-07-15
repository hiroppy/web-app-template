import { expect, type Locator, type Page } from "@playwright/test";
import { Base } from "./Base";

export class MePage extends Base {
  inputNameLocator: Locator;
  buttonSubmitLocator: Locator;

  constructor(page: Page) {
    super(page);

    this.inputNameLocator = this.page.locator('input[name="name"]');
    this.buttonSubmitLocator = this.page.getByRole("button", { name: "Save" });
  }

  async goTo() {
    return await this.page.goto("/me");
  }

  async changeName(name: string) {
    await this.inputNameLocator.fill(name);
  }

  async submit() {
    await this.buttonSubmitLocator.click();
  }

  async expectUI(name: string) {
    await expect(this.inputNameLocator).toBeVisible();
    await expect(this.buttonSubmitLocator).toBeVisible();
    await expect(this.inputNameLocator).toHaveValue(name);
  }

  async expectInputNameErrorUI() {
    const id = await this.inputNameLocator.getAttribute("id");
    const inputNameErrorLocator = this.page.locator(`#${id}-error`);

    await expect(inputNameErrorLocator).toBeVisible();
    await expect(inputNameErrorLocator).toHaveText("name is too short");
  }
}
