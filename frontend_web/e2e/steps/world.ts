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

  async bypassSignin(email = "test@example.com", password = "password123") {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Signin failed with status ${response.status}`);
    }

    const data = await response.json();
    const accessToken = data.accessToken;

    if (!accessToken) {
      throw new Error("No access token in signin response");
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

    await this.page.goto(ROUTES.USER_LIST);
  }
}

setWorldConstructor(CustomWorld);
