import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { CustomWorld } from "./world";
import { SigninTestIds, SignupTestIds } from "../../features/auth/test-ids";
import { SharedTestIds } from "../../features/shared/test-ids";
import { ROUTES } from "../../features/shared/lib/constants";

/**
 * 前提条件: サインアップページにアクセス
 */
Given("サインアップページにアクセス", async function (this: CustomWorld) {
  await this.page.goto(ROUTES.SIGNUP);
});

/**
 * 前提条件: サインインページにアクセス
 */
Given("サインインページにアクセス", async function (this: CustomWorld) {
  await this.page.goto(ROUTES.SIGNIN);
});

/**
 * アクション: メールアドレスを入力
 */
When(
  "メールアドレスに {string} を入力",
  async function (this: CustomWorld, email: string) {
    const currentUrl = this.page.url();
    if (currentUrl.includes(ROUTES.SIGNIN)) {
      await this.page.getByTestId(SigninTestIds.emailInput).fill(email);
    } else if (currentUrl.includes(ROUTES.SIGNUP)) {
      await this.page.getByTestId(SignupTestIds.emailInput).fill(email);
    }
  },
);

/**
 * アクション: パスワードを入力
 */
When(
  "パスワードに {string} を入力",
  async function (this: CustomWorld, password: string) {
    const currentUrl = this.page.url();
    if (currentUrl.includes(ROUTES.SIGNIN)) {
      await this.page.getByTestId(SigninTestIds.passwordInput).fill(password);
    } else if (currentUrl.includes(ROUTES.SIGNUP)) {
      await this.page.getByTestId(SignupTestIds.passwordInput).fill(password);
    }
  },
);

/**
 * アクション: サインアップボタンをクリック
 */
When("サインアップボタンをクリック", async function (this: CustomWorld) {
  await this.page.getByTestId(SignupTestIds.submitButton).click();
});

/**
 * アクション: サインインボタンをクリック
 */
When("サインインボタンをクリック", async function (this: CustomWorld) {
  await this.page.getByTestId(SigninTestIds.submitButton).click();
});

/**
 * 検証: サインインページに遷移
 */
Then("サインインページに遷移", async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(ROUTES.SIGNIN, { timeout: 10000 });
});

/**
 * 検証: ユーザー画面に遷移
 */
Then("ユーザー画面に遷移", async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(ROUTES.USER_LIST, { timeout: 10000 });
});

/**
 * 検証: バリデーションエラーを表示
 */
Then("バリデーションエラーを表示", async function (this: CustomWorld) {
  await expect(
    this.page.getByTestId(SharedTestIds.textFieldError).first(),
  ).toBeVisible();
});
