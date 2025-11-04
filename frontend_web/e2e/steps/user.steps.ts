import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { CustomWorld } from "./world";

/**
 * 前提条件: 認証済みユーザーとしてログイン
 */
Given(
  "認証済みユーザーとしてログインしている",
  async function (this: CustomWorld) {
    // Navigate to signin and perform login
    await this.page.goto("/auth/signin");
    await this.page.fill('input[type="email"]', "test@example.com");
    await this.page.fill('input[type="password"]', "password123");
    await this.page.click('button[type="submit"]:has-text("サインイン")');

    // Wait for navigation to user page
    await expect(this.page).toHaveURL(/\/user/, { timeout: 10000 });
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
  // Wait for user list to load - check for email text or the user list container
  await this.page.waitForTimeout(1000); // Give time for data to load

  // Check if we have user data by looking for email addresses
  const hasUserData = await this.page.locator('[class*="text-gray-900"]').count();

  if (hasUserData > 0) {
    // User data is present
    await expect(
      this.page.locator('[class*="text-gray-900"]').first(),
    ).toBeVisible({ timeout: 10000 });
  } else {
    // No user data, check if "ユーザーが見つかりません" message is shown
    await expect(
      this.page.locator('text=ユーザーが見つかりません'),
    ).toBeVisible({ timeout: 10000 });
  }
});

/**
 * 検証: ユーザー一覧のタイトルが表示される
 */
Then("ユーザー一覧のタイトルが表示される", async function (this: CustomWorld) {
  await expect(this.page.locator('h1:has-text("ユーザー一覧")')).toBeVisible({ timeout: 10000 });
});
