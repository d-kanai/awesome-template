import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { CustomWorld } from "./world";
import { SigninTestIds, SignupTestIds } from "../../features/auth/test-ids";

/**
 * 前提条件: サインアップページにアクセス
 */
Given("サインアップページにアクセスする", async function (this: CustomWorld) {
  await this.page.goto("/auth/signup");
});

/**
 * 前提条件: サインインページにアクセス
 */
Given("サインインページにアクセスする", async function (this: CustomWorld) {
  await this.page.goto("/auth/signin");
});

/**
 * アクション: メールアドレスを入力
 */
When(
  "メールアドレスに {string} を入力する",
  async function (this: CustomWorld, email: string) {
    const currentUrl = this.page.url();
    if (currentUrl.includes("/auth/signin")) {
      await this.page.getByTestId(SigninTestIds.emailInput).fill(email);
    } else if (currentUrl.includes("/auth/signup")) {
      await this.page.getByTestId(SignupTestIds.emailInput).fill(email);
    }
  },
);

/**
 * アクション: パスワードを入力
 */
When(
  "パスワードに {string} を入力する",
  async function (this: CustomWorld, password: string) {
    const currentUrl = this.page.url();
    if (currentUrl.includes("/auth/signin")) {
      await this.page.getByTestId(SigninTestIds.passwordInput).fill(password);
    } else if (currentUrl.includes("/auth/signup")) {
      await this.page.getByTestId(SignupTestIds.passwordInput).fill(password);
    }
  },
);

/**
 * アクション: サインアップボタンをクリック
 */
When("サインアップボタンをクリックする", async function (this: CustomWorld) {
  await this.page.getByTestId(SignupTestIds.submitButton).click();
});

/**
 * アクション: サインインボタンをクリック
 */
When("サインインボタンをクリックする", async function (this: CustomWorld) {
  await this.page.getByTestId(SigninTestIds.submitButton).click();
});

/**
 * 検証: サインインページに遷移
 */
Then("サインインページに遷移する", async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/\/auth\/signin/, { timeout: 10000 });
});

/**
 * 検証: ユーザー画面に遷移
 */
Then("ユーザー画面に遷移する", async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/\/user/, { timeout: 10000 });
});

/**
 * 検証: バリデーションエラーが表示される
 */
Then("バリデーションエラーが表示される", async function (this: CustomWorld) {
  await expect(this.page.locator(".text-red-600").first()).toBeVisible();
});
