import { expect, type Locator, type Page } from "@playwright/test";
import type { User } from "../../src/app/_clients/betterAuth";

export class Base {
  page: Page;
  headerLocator: Locator;
  headerButtonSignInLocator: Locator;
  headerButtonSignOutLocator: Locator;
  headerLinkMyPageLocator: Locator;
  headerImageMyAvatorLocator: Locator;
  footerLocator: Locator;
  footerLinkRepositoryLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerLocator = this.page.locator("header");
    this.headerButtonSignInLocator = this.headerLocator.getByRole("button", {
      name: "Sign in",
    });
    this.headerButtonSignOutLocator = this.headerLocator.getByRole("button", {
      name: "Sign out",
    });
    this.headerLinkMyPageLocator = this.headerLocator.locator("a[href='/me']");
    this.headerImageMyAvatorLocator = this.headerLocator.getByRole("img", {
      name: "profile",
    });
    this.footerLocator = this.page.locator("footer");
    this.footerLinkRepositoryLocator = this.footerLocator.getByRole("link", {
      name: "Repository",
    });
  }

  async goToMePage() {
    await this.headerLinkMyPageLocator.click();
  }

  async expectHeaderUI(state: "signIn" | "signOut", user?: User) {
    if (state === "signIn") {
      await expect(this.headerButtonSignInLocator).not.toBeVisible();
      await expect(this.headerButtonSignOutLocator).toBeVisible();
      expect(await this.headerImageMyAvatorLocator.getAttribute("src")).toBe(
        user?.image,
      );
    }

    if (state === "signOut") {
      await expect(this.headerButtonSignInLocator).toBeVisible();
      await expect(this.headerButtonSignOutLocator).not.toBeVisible();
      await expect(this.headerButtonSignInLocator).toBeVisible();
    }
  }

  async expectFooterUI() {
    await expect(this.footerLinkRepositoryLocator).toBeVisible();
    await expect(this.footerLinkRepositoryLocator).toHaveAttribute(
      "href",
      "https://github.com/hiroppy/web-app-template",
    );
  }
}
