import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import type { User } from "next-auth";

export class Base {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async init() {
    await this.page.goto(process.env.NEXT_PUBLIC_SITE_URL, {
      waitUntil: "networkidle",
    });
  }

  async expectHeaderUI(state: "signIn" | "signOut", user: User) {
    if (state === "signIn") {
      await expect(
        this.page.getByRole("button", { name: "Sign out" }),
      ).toBeVisible();
      expect(
        await this.page
          .getByRole("img", { name: "profile" })
          .getAttribute("src"),
      ).toBe(user.image);
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
}
