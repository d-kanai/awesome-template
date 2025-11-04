import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { CustomWorld } from "./world";

/**
 * 前提条件: 認証済みユーザーとしてログイン
 */
Given(
  "認証済みユーザーとしてログインしている",
  async function (this: CustomWorld) {
    // Note: In a real scenario, you would set up authentication state here
    // For now, we'll just navigate to signin and perform login
    await this.page.goto("/auth/signin");
    await this.page.fill('input[type="email"]', "test@example.com");
    await this.page.fill('input[type="password"]', "password123");
    await this.page.click('button[type="submit"]:has-text("サインイン")');
  },
);

/**
 * アクション: ユーザー画面にアクセス
 */
When("ユーザー画面にアクセスする", async function (this: CustomWorld) {
  await this.page.goto("/user");
});

/**
 * 検証: ユーザー一覧が表示される
 */
Then("ユーザー一覧が表示される", async function (this: CustomWorld) {
  // Wait for the user list to be visible
  await expect(
    this.page.locator(".space-y-6, .divide-y").first(),
  ).toBeVisible({ timeout: 10000 });
});

/**
 * 検証: ユーザー一覧のタイトルが表示される
 */
Then("ユーザー一覧のタイトルが表示される", async function (this: CustomWorld) {
  await expect(this.page.locator('h1:has-text("ユーザー一覧")')).toBeVisible({ timeout: 10000 });
});
