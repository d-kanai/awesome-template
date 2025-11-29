import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { SigninTestIds, SignupTestIds } from "../../features/auth/ids";
import { AUTH_ROUTES } from "../../features/auth/routes";
import { USER_ROUTES } from "../../features/user/routes";
import type { CustomWorld } from "./world";

// Scenario: 新規ユーザーのサインアップ
Given("サインアップページにアクセス", async function (this: CustomWorld) {
  await this.page.goto(AUTH_ROUTES.SIGNUP);
  await this.page.waitForLoadState("networkidle");
});

When(
  "サインアップページのメールアドレスに {string} を入力",
  async function (this: CustomWorld, email: string) {
    await this.page.getByTestId(SignupTestIds.emailInput).fill(email);
  },
);

When(
  "サインアップページのパスワードに {string} を入力",
  async function (this: CustomWorld, password: string) {
    await this.page.getByTestId(SignupTestIds.passwordInput).fill(password);
  },
);

When("サインアップボタンをクリック", async function (this: CustomWorld) {
  await this.page.getByTestId(SignupTestIds.submitButton).click();
  await this.page.waitForLoadState("networkidle");
});

Then("サインインページに遷移", async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(AUTH_ROUTES.SIGNIN);
});

// Scenario: 既存ユーザーのサインイン
Given("サインインページにアクセス", async function (this: CustomWorld) {
  await this.page.goto(AUTH_ROUTES.SIGNIN);
  await this.page.waitForLoadState("networkidle");
});

When(
  "サインインページのメールアドレスに {string} を入力",
  async function (this: CustomWorld, email: string) {
    await this.page.getByTestId(SigninTestIds.emailInput).fill(email);
  },
);

When(
  "サインインページのパスワードに {string} を入力",
  async function (this: CustomWorld, password: string) {
    await this.page.getByTestId(SigninTestIds.passwordInput).fill(password);
  },
);

When("サインインボタンをクリック", async function (this: CustomWorld) {
  await this.page.getByTestId(SigninTestIds.submitButton).click();
  await this.page.waitForLoadState("networkidle");
});

Then("ユーザー画面に遷移", async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(USER_ROUTES.USER_LIST);
});

// Scenario: 無効なメールアドレスでのサインイン失敗
Then("バリデーションエラーを表示", async function (this: CustomWorld) {
  // クライアントサイドバリデーションエラーメッセージを確認
  const errorMessage = this.page.getByText(
    "有効なメールアドレスを入力してください",
  );
  await expect(errorMessage).toBeVisible();
});
