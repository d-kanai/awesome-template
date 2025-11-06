import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { type Browser, chromium } from "@playwright/test";
import { API_BASE_URL } from "../../features/shared/lib/constants";
import type { CustomWorld } from "../steps/world";

// デフォルトタイムアウトを30秒に設定
setDefaultTimeout(30000);

let browser: Browser;

/**
 * Before all tests: Launch browser and reset database
 */
BeforeAll(async () => {
  // Reset database before starting tests
  try {
    const response = await fetch(`${API_BASE_URL}/e2e/reset_data`, {
      method: "POST",
    });
    if (!response.ok) {
      console.warn(`Failed to reset database: ${response.status}`);
    } else {
      console.log("[E2E] Database reset successful");
    }
  } catch (error) {
    console.warn("[E2E] Failed to reset database:", error);
  }

  browser = await chromium.launch({
    headless: true,
  });
});

/**
 * After all tests: Close browser
 */
AfterAll(async () => {
  await browser.close();
});

/**
 * Before each scenario: Create new page
 */
Before(async function (this: CustomWorld) {
  this.context = await browser.newContext({
    baseURL: process.env.BASE_URL || "http://localhost:3000",
  });
  this.page = await this.context.newPage();
  this.browser = browser;

  // Capture browser console logs
  this.page.on("console", (msg) => {
    console.log(`[Browser Console ${msg.type()}]:`, msg.text());
  });

  // Capture page errors
  this.page.on("pageerror", (error) => {
    console.error("[Browser Error]:", error.message);
  });
});

/**
 * After each scenario: Close page
 */
After(async function (this: CustomWorld) {
  await this.page.close();
  await this.context.close();
});
