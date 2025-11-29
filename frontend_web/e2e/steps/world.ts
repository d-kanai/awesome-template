import { setWorldConstructor, World } from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "@playwright/test";
import { USER_ROUTES } from "../../features/user/routes";
import { CookieManager } from "../../shared/lib/cookieManager";
import { env } from "../../shared/lib/env";
import { SHARED_ROUTES } from "../../shared/lib/routes";

const API_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL;
const IS_MOCK_MODE = env.NEXT_PUBLIC_API_MOCK_MODE;

export class CustomWorld extends World {
  page!: Page;
  browser!: Browser;
  context!: BrowserContext;

  async bypassSignin() {
    // Mock mode: Use dummy token without backend API call
    if (IS_MOCK_MODE) {
      console.log("[E2E] Mock mode: Using dummy access token");
      await this.context.addCookies([
        {
          name: CookieManager.KEYS.ACCESS_TOKEN,
          value: "mock-access-token-for-e2e-testing",
          domain: "localhost",
          path: "/",
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
        },
      ]);

      await this.page.goto(SHARED_ROUTES.HOME);
      await this.page.waitForLoadState("networkidle");
      await this.page.goto(USER_ROUTES.USER_LIST);
      return;
    }

    // Real mode: Get token from backend
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
        name: CookieManager.KEYS.ACCESS_TOKEN,
        value: accessToken,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ]);

    await this.page.goto(SHARED_ROUTES.HOME);
    await this.page.waitForLoadState("networkidle");
    await this.page.goto(USER_ROUTES.USER_LIST);
  }
}

setWorldConstructor(CustomWorld);
