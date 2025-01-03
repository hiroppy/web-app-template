import type { Locator, Page } from "@playwright/test";
import type { User } from "next-auth";
import { expect } from "../fixtures";

export class Base {
  page: Page;
  signInLocator: Locator;
  signOutLocator: Locator;
  profileImageLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInLocator = this.page.getByRole("button", { name: "Sign in" });
    this.signOutLocator = this.page.getByRole("button", { name: "Sign out" });
    this.profileImageLocator = this.page.getByRole("img", { name: "profile" });
  }

  async init() {
    await this.page.goto(process.env.NEXT_PUBLIC_SITE_URL, {
      waitUntil: "networkidle",
    });
  }

  async expectHeaderUI(state: "signIn" | "signOut", user: User) {
    if (state === "signIn") {
      await expect(this.signOutLocator).toBeVisible();
      expect(await this.profileImageLocator.getAttribute("src")).toBe(
        user.image,
      );
    }

    if (state === "signOut") {
      await expect(this.signInLocator).toBeVisible();
    }
  }
}
