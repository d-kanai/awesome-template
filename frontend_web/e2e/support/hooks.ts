import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { type Browser, chromium } from "@playwright/test";
import { env } from "../../features/shared/lib/env";
import type { CustomWorld } from "../steps/world";

const API_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL;

setDefaultTimeout(30000);

let browser: Browser;

BeforeAll(async () => {
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

  try {
    const response = await fetch(`${API_BASE_URL}/e2e/create_data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ table: "user" }),
    });
    if (!response.ok) {
      console.warn(`Failed to create test data: ${response.status}`);
    } else {
      console.log("[E2E] Test data created successfully");
    }
  } catch (error) {
    console.warn("[E2E] Failed to create test data:", error);
  }

  browser = await chromium.launch({
    headless: false,
  });
});

AfterAll(async () => {
  await browser.close();
});

Before(async function (this: CustomWorld) {
  this.context = await browser.newContext({
    baseURL: process.env.BASE_URL || "http://localhost:3000",
  });
  this.page = await this.context.newPage();
  this.browser = browser;

  this.page.on("console", (msg) => {
    console.log(`[Browser Console ${msg.type()}]:`, msg.text());
  });

  this.page.on("pageerror", (error) => {
    console.error("[Browser Error]:", error.message);
  });
});

After(async function (this: CustomWorld) {
  await this.page.close();
  await this.context.close();
});
