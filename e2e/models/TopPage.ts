import { expect, type Locator, type Page } from "@playwright/test";
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

    this.textUserStatusLabelLocator = this.page.getByText(
      /you are (signed in as|not signed in)/,
    );
    /* start: sample */
    this.buttonAddItemLocator = this.page.getByRole("button", {
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
        const title = await item.getByRole("link").innerText();

        return {
          img,
          title,
        };
      }),
    );

    return res;
  }

  async addItem(content: string) {
    const inputCreateContentLocator = this.page.locator(
      'input[name="content"]',
    );
    const inputCreateContentErrorLocator = this.page.locator(
      `#${await inputCreateContentLocator.getAttribute("id")}-error`,
    );

    await inputCreateContentLocator.fill(content);
    await expect(inputCreateContentErrorLocator).not.toBeVisible();
    await this.buttonAddItemLocator.click();

    await this.page.waitForLoadState("networkidle");
    await expect(inputCreateContentLocator).toHaveValue("");
  }

  async deleteAllItems() {
    await this.buttonDeleteItemsLocator.click();
    await this.page.waitForLoadState("networkidle");
    await expect(this.page.getByRole("list", { name: "items" })).toBeEmpty();
  }

  async expectItems(
    expected: {
      img: string;
      title: string;
    }[],
  ) {
    expect(await this.getItems()).toMatchObject(expected);
  }

  async clickItemByTitle(title: string) {
    const itemLink = this.page.getByRole("link", {
      name: title,
    });
    await itemLink.click();
  }
  /* end: sample */
}
