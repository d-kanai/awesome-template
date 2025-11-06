import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { CustomWorld } from "./world";
import { UserTestIds } from "../../features/user/test-ids";
import { ROUTES } from "../../features/shared/lib/constants";

Given("認証済みユーザーとしてログイン", async function (this: CustomWorld) {
  await this.quickLogin();
});

When("ユーザー画面にアクセス", async function (this: CustomWorld) {
  await this.page.goto(ROUTES.USER_LIST);
});

Then("ユーザー一覧を表示", async function (this: CustomWorld) {
  await expect(this.page.getByTestId(UserTestIds.userList)).toBeVisible({
    timeout: 10000,
  });
});

Then("ユーザー一覧のタイトルを表示", async function (this: CustomWorld) {
  await expect(this.page.getByTestId(UserTestIds.pageTitle)).toBeVisible({
    timeout: 10000,
  });
});
