import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { AUTH_ROUTES } from "../../features/auth/routes";
import { SigninTestIds, SignupTestIds } from "../../features/auth/test-ids";
import { SharedTestIds } from "../../features/shared/test-ids";
import { USER_ROUTES } from "../../features/user/routes";
import type { CustomWorld } from "./world";

Given("サインアップページにアクセス", async function (this: CustomWorld) {
	await this.page.goto(AUTH_ROUTES.SIGNUP);
});

Given("サインインページにアクセス", async function (this: CustomWorld) {
	await this.page.goto(AUTH_ROUTES.SIGNIN);
});

When(
	"メールアドレスに {string} を入力",
	async function (this: CustomWorld, email: string) {
		const currentUrl = this.page.url();
		if (currentUrl.includes(AUTH_ROUTES.SIGNIN)) {
			await this.page.getByTestId(SigninTestIds.emailInput).fill(email);
		} else if (currentUrl.includes(AUTH_ROUTES.SIGNUP)) {
			await this.page.getByTestId(SignupTestIds.emailInput).fill(email);
		}
	},
);

When(
	"パスワードに {string} を入力",
	async function (this: CustomWorld, password: string) {
		const currentUrl = this.page.url();
		if (currentUrl.includes(AUTH_ROUTES.SIGNIN)) {
			await this.page.getByTestId(SigninTestIds.passwordInput).fill(password);
		} else if (currentUrl.includes(AUTH_ROUTES.SIGNUP)) {
			await this.page.getByTestId(SignupTestIds.passwordInput).fill(password);
		}
	},
);

When("サインアップボタンをクリック", async function (this: CustomWorld) {
	await this.page.getByTestId(SignupTestIds.submitButton).click();
});

When("サインインボタンをクリック", async function (this: CustomWorld) {
	await this.page.getByTestId(SigninTestIds.submitButton).click();
});

Then("サインインページに遷移", async function (this: CustomWorld) {
	await expect(this.page).toHaveURL(AUTH_ROUTES.SIGNIN, { timeout: 10000 });
});

Then("ユーザー画面に遷移", async function (this: CustomWorld) {
	await expect(this.page).toHaveURL(USER_ROUTES.USER_LIST, { timeout: 10000 });
});

Then("バリデーションエラーを表示", async function (this: CustomWorld) {
	await expect(
		this.page.getByTestId(SharedTestIds.textFieldError).first(),
	).toBeVisible();
});
