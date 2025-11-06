import { World, setWorldConstructor } from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { SigninTestIds } from "../../features/auth/test-ids";
import { ROUTES } from "../../features/shared/lib/constants";

export class CustomWorld extends World {
  page!: Page;
  browser!: Browser;
  context!: BrowserContext;

  async quickLogin(email = "test@example.com", password = "password123") {
    await this.page.goto(ROUTES.SIGNIN);
    await this.page.getByTestId(SigninTestIds.emailInput).fill(email);
    await this.page.getByTestId(SigninTestIds.passwordInput).fill(password);
    await this.page.getByTestId(SigninTestIds.submitButton).click();
    await expect(this.page).toHaveURL(ROUTES.USER_LIST, { timeout: 10000 });
  }
}

setWorldConstructor(CustomWorld);
