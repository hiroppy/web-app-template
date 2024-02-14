import { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { IMAGE } from "../constants";

export class Base {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async init() {
    await this.page.goto("http://localhost:3000");
    await this.page.waitForLoadState("networkidle");
  }

  async expectHeaderUI(state: "signIn" | "signOut") {
    if (state === "signIn") {
      await expect(
        this.page.getByRole("button", { name: "Sign out" }),
      ).toBeVisible();
      expect(
        await this.page
          .getByRole("img", { name: "e2e-test" })
          .getAttribute("src"),
      ).toBe(IMAGE);
      expect(
        await this.page
          .getByRole("link", { name: "Add an item" })
          .getAttribute("href"),
      ).toBe("/create");
    }

    if (state === "signOut") {
      await expect(
        this.page.getByRole("button", { name: "Sign in" }),
      ).toBeVisible();
      await expect(
        this.page.getByRole("link", { name: "Add an item" }),
      ).not.toBeVisible();
    }
  }

  async addItem(content: string) {
    expect(
      await this.page
        .getByRole("link", { name: "Add an item" })
        .getAttribute("href"),
    ).toBe("/create");
    await this.page.getByRole("link", { name: "Add an item" }).click();

    await this.page.getByLabel("New Memo").fill(content);
    await this.page.keyboard.press("Enter");
    await this.page.waitForLoadState("networkidle");
    await this.page.goto("/");
  }
}
