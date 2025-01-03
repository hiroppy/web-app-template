import { expect } from "@playwright/test";
import { Base } from "./Base";

export class TopPage extends Base {
  async goTo() {
    await this.page.goto("/");
  }

  async expectUI(state: "signIn" | "signOut") {
    if (state === "signIn") {
      await expect(
        this.page.getByRole("button", { name: "Delete my items" }),
      ).toBeVisible();
    }

    if (state === "signOut") {
      await expect(
        this.page.getByRole("button", { name: "Delete my items" }),
      ).not.toBeVisible();
    }
  }

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
    expect(
      await this.page
        .getByRole("link", { name: "Add an item" })
        .getAttribute("href"),
    ).toBe("/create");

    await this.page.getByRole("link", { name: "Add an item" }).click();

    await this.page.fill("#content", content);
    await this.page.keyboard.press("Enter");
    await this.page.waitForLoadState("networkidle");
    await this.page.goto("/");
  }

  async deleteAllItems() {
    await this.page.getByRole("button", { name: "Delete my items" }).click();
    await this.page.waitForLoadState("networkidle");
  }
}
