import { World, setWorldConstructor } from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "@playwright/test";

/**
 * Custom World class for Cucumber tests
 * Provides Playwright Page and Browser instances to step definitions
 */
export class CustomWorld extends World {
  page!: Page;
  browser!: Browser;
  context!: BrowserContext;
}

setWorldConstructor(CustomWorld);
