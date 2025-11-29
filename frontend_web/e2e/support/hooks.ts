import * as fs from "node:fs";
import * as path from "node:path";
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
const IS_MOCK_MODE = env.NEXT_PUBLIC_API_MOCK_MODE;

// HAR recording for DAST (enabled via environment variable)
const RECORD_HAR = process.env.RECORD_HAR === "true";
const HAR_OUTPUT_DIR = process.env.HAR_OUTPUT_DIR || "./e2e-har";

setDefaultTimeout(30000);

let browser: Browser;

BeforeAll(async () => {
  // Mock mode: Skip backend API calls
  if (!IS_MOCK_MODE) {
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
  } else {
    console.log("[E2E] Mock mode enabled - skipping backend data setup");
  }

  browser = await chromium.launch({
    headless: !!process.env.CI,
  });
});

AfterAll(async () => {
  await browser.close();
});

// Track scenario count for unique HAR filenames
let scenarioCount = 0;

Before(async function (this: CustomWorld) {
  scenarioCount++;

  // Create HAR output directory if recording is enabled
  if (RECORD_HAR && !fs.existsSync(HAR_OUTPUT_DIR)) {
    fs.mkdirSync(HAR_OUTPUT_DIR, { recursive: true });
  }

  // Context options with optional HAR recording
  const contextOptions: Parameters<Browser["newContext"]>[0] = {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
  };

  if (RECORD_HAR) {
    contextOptions.recordHar = {
      path: path.join(HAR_OUTPUT_DIR, `scenario-${scenarioCount}.har`),
      mode: "full",
      content: "omit", // Don't record response content to reduce size
    };
    console.log(`[E2E] HAR recording enabled: scenario-${scenarioCount}.har`);
  }

  this.context = await browser.newContext(contextOptions);
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
