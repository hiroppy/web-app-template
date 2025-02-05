import { type Locator, type Page, expect } from "@playwright/test";
import type { User } from "next-auth";
import { Base } from "./Base";

export class TopPage extends Base {
  textUserStatusLabelLocator: Locator;
  /* start: sample */
  buttonAddItemLocator: Locator;
  buttonDeleteItemsLocator: Locator;
  /* end: sample */

  constructor(page: Page) {
    super(page);

    this.textUserStatusLabelLocator = this.page.locator(
      '[aria-label="User status"]',
    );
    /* start: sample */
    this.buttonAddItemLocator = this.page.getByRole("link", {
      name: "Add an item",
    });
    this.buttonDeleteItemsLocator = this.page.getByRole("button", {
      name: "Delete my items",
    });
    /* end: sample */
  }

  async goTo() {
    return await this.page.goto("/");
  }

  async expectUI(state: "signIn" | "signOut", user?: User) {
    if (state === "signIn") {
      await expect(this.textUserStatusLabelLocator).toContainText(
        `you are signed in as ${user?.name} 😄`,
      );
      /* start: sample */
      await expect(this.buttonDeleteItemsLocator).toBeVisible();
      await expect(this.buttonAddItemLocator).toBeVisible();
      /* end: sample */
    }

    if (state === "signOut") {
      await expect(this.textUserStatusLabelLocator).toContainText(
        "you are not signed in 🥲",
      );
      /* start: sample */
      await expect(this.buttonDeleteItemsLocator).not.toBeVisible();
      await expect(this.buttonAddItemLocator).not.toBeVisible();
      /* end: sample */
    }
  }

  /* start: sample */
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
    expect(await this.buttonAddItemLocator.getAttribute("href")).toBe(
      "/create",
    );

    await this.buttonAddItemLocator.click();
    await this.page.fill("#input-content", content);
    await this.page.keyboard.press("Enter");
    await this.page.waitForLoadState("networkidle");
    await this.page.goto("/");
  }

  async deleteAllItems() {
    await this.buttonDeleteItemsLocator.click();
    await this.page.waitForLoadState("networkidle");
  }

  async expectItems(
    expected: {
      img: string;
      title: string;
    }[],
  ) {
    expect(await this.getItems()).toMatchObject(expected);
  }
  /* end: sample */
}
