import { World, setWorldConstructor } from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "@playwright/test";
import {
  API_BASE_URL,
  COOKIE_KEYS,
  ROUTES,
} from "../../features/shared/lib/constants";

export class CustomWorld extends World {
  page!: Page;
  browser!: Browser;
  context!: BrowserContext;

  async bypassSignin() {
    const response = await fetch(`${API_BASE_URL}/e2e/dummy_token`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get dummy token with status ${response.status}`,
      );
    }

    const data = await response.json();
    const accessToken = data.token;

    if (!accessToken) {
      throw new Error("No access token in dummy token response");
    }

    await this.context.addCookies([
      {
        name: COOKIE_KEYS.ACCESS_TOKEN,
        value: accessToken,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ]);

    await this.page.goto(ROUTES.HOME);
    await this.page.waitForLoadState("networkidle");
    await this.page.goto(ROUTES.USER_LIST);
  }
}

setWorldConstructor(CustomWorld);
