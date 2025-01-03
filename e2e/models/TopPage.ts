import type { Locator, Page } from "@playwright/test";
import type { User } from "next-auth";
import { expect } from "../fixtures";
import { Base } from "./Base";

export class TopPage extends Base {
  userStatusLabelLocator: Locator;
  addItemLocator: Locator;
  deleteItemsLocator: Locator;

  constructor(page: Page) {
    super(page);

    this.userStatusLabelLocator = this.page.locator(
      '[aria-label="User status"]',
    );
    this.addItemLocator = this.page.getByRole("link", { name: "Add an item" });
    this.deleteItemsLocator = this.page.getByRole("button", {
      name: "Delete my items",
    });
  }

  async goTo() {
    await this.init();

    return await this.page.goto("/");
  }

  async expectUI(state: "signIn" | "signOut", user?: User) {
    if (state === "signIn") {
      await expect(this.userStatusLabelLocator).toContainText(
        `you are signed in as ${user?.name} 😄`,
      );
      await expect(this.deleteItemsLocator).toBeVisible();
      await expect(this.addItemLocator).toBeVisible();
    }

    if (state === "signOut") {
      await expect(this.userStatusLabelLocator).toContainText(
        "you are not signed in 🥲",
      );
      await expect(this.deleteItemsLocator).not.toBeVisible();
      await expect(this.addItemLocator).not.toBeVisible();
    }
  }

  async getWelcomeLabel(userName?: string) {}

  async getItems() {
    const items = await this.page
      .getByRole("list", { name: "items" })
      .getByRole("listitem")
      .all();
    const res = await Promise.all(
      items.map(async (item) => {
        const img = await item.getByRole("img").getAttribute("src");
        const title = await item.getByRole("heading").innerText();

        return {
          img,
          title,
        };
      }),
    );

    return res;
  }

  async addItem(content: string) {
    expect(await this.addItemLocator.getAttribute("href")).toBe("/create");

    await this.addItemLocator.click();
    await this.page.fill("#content", content);
    await this.page.keyboard.press("Enter");
    await this.page.waitForLoadState("networkidle");
    await this.page.goto("/");
  }

  async deleteAllItems() {
    await this.deleteItemsLocator.click();
    await this.page.waitForLoadState("networkidle");
  }
}
