import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { AUTH_ROUTES } from "../../features/auth/routes";
import { SigninTestIds } from "../../features/auth/test-ids";
import { USER_ROUTES } from "../../features/user/routes";
import { UserTestIds } from "../../features/user/test-ids";
import type { CustomWorld } from "./world";

// 認証済みユーザーとしてログイン（サインインしてユーザー画面に遷移した状態にする）
Given("認証済みユーザーとしてログイン", async function (this: CustomWorld) {
  await this.page.goto(AUTH_ROUTES.SIGNIN);
  await this.page.waitForLoadState("networkidle");

  // テスト用認証情報でサインイン
  await this.page
    .getByTestId(SigninTestIds.emailInput)
    .fill("test@example.com");
  await this.page.getByTestId(SigninTestIds.passwordInput).fill("password123");
  await this.page.getByTestId(SigninTestIds.submitButton).click();
  await this.page.waitForLoadState("networkidle");

  // ユーザー画面に遷移したことを確認
  await expect(this.page).toHaveURL(USER_ROUTES.USER_LIST);
});

When("ユーザー画面にアクセス", async function (this: CustomWorld) {
  await this.page.goto(USER_ROUTES.USER_LIST);
  await this.page.waitForLoadState("networkidle");
});

Then("ユーザー一覧を表示", async function (this: CustomWorld) {
  const userList = this.page.getByTestId(UserTestIds.userList);
  await expect(userList).toBeVisible();
});

Then("ユーザー一覧のタイトルを表示", async function (this: CustomWorld) {
  const pageTitle = this.page.getByTestId(UserTestIds.pageTitle);
  await expect(pageTitle).toBeVisible();
  await expect(pageTitle).toHaveText("ユーザー一覧");
});
