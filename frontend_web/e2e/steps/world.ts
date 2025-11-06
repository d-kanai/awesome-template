import { World, setWorldConstructor } from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "@playwright/test";

export class CustomWorld extends World {
  page!: Page;
  browser!: Browser;
  context!: BrowserContext;
}

setWorldConstructor(CustomWorld);
