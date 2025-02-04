import { type Locator, type Page, expect } from "@playwright/test";
import type { User } from "next-auth";

export class Base {
  page: Page;
  headerButtonSignInLocator: Locator;
  headerButtonSignOutLocator: Locator;
  headerLinkMyPageLocator: Locator;
  headerImageMyAvatorLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerButtonSignInLocator = this.page.getByRole("button", {
      name: "Sign in",
    });
    this.headerButtonSignOutLocator = this.page.getByRole("button", {
      name: "Sign out",
    });
    this.headerLinkMyPageLocator = this.page.locator("a[href='/me']");
    this.headerImageMyAvatorLocator = this.page.getByRole("img", {
      name: "profile",
    });
  }

  async goToMePage() {
    await this.headerLinkMyPageLocator.click();
  }

  async expectHeaderUI(state: "signIn" | "signOut", user: User) {
    if (state === "signIn") {
      await expect(this.headerButtonSignInLocator).not.toBeVisible();
      await expect(this.headerButtonSignOutLocator).toBeVisible();
      expect(await this.headerImageMyAvatorLocator.getAttribute("src")).toBe(
        user.image,
      );
    }

    if (state === "signOut") {
      await expect(this.headerButtonSignInLocator).toBeVisible();
      await expect(this.headerButtonSignOutLocator).not.toBeVisible();
      await expect(this.headerButtonSignOutLocator).toBeVisible();
    }
  }
}
