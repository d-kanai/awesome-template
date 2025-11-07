"use client";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { TextField } from "@/features/shared/components/TextField";
import { Button } from "@/features/shared/figma_generated/Button";
import Link from "next/link";
import { useSigninForm } from "../hooks/useSigninForm";
import { SigninTestIds } from "../test-ids";

function EmailField({
	register,
	error,
	disabled,
}: {
	register: ReturnType<typeof useSigninForm>["form"]["register"];
	error?: string;
	disabled: boolean;
}) {
	return (
		<TextField
			id="signin-email"
			data-testid={SigninTestIds.emailInput}
			label="メールアドレス"
			type="email"
			placeholder="email@example.com"
			disabled={disabled}
			error={error}
			{...register("email")}
		/>
	);
}

function PasswordField({
	register,
	error,
	disabled,
}: {
	register: ReturnType<typeof useSigninForm>["form"]["register"];
	error?: string;
	disabled: boolean;
}) {
	return (
		<TextField
			id="signin-password"
			data-testid={SigninTestIds.passwordInput}
			label="パスワード"
			type="password"
			placeholder="パスワード"
			disabled={disabled}
			error={error}
			{...register("password")}
		/>
	);
}

function ErrorMessage({ error }: { error: string }) {
	return (
		<div
			className="rounded-md bg-red-50 p-4"
			data-testid={SigninTestIds.errorMessage}
		>
			<p className="text-sm text-red-800">{error}</p>
		</div>
	);
}

function SubmitButton({ disabled }: { disabled: boolean }) {
	return (
		<Button
			type="submit"
			disabled={disabled}
			className="w-full"
			data-testid={SigninTestIds.submitButton}
		>
			サインイン
		</Button>
	);
}

function SuggestSignupSection() {
	return (
		<p className="text-center text-sm text-gray-600">
			アカウントをお持ちでないですか？{" "}
			<Link
				href={AUTH_ROUTES.SIGNUP}
				className="font-medium text-blue-600 hover:text-blue-500"
				data-testid={SigninTestIds.signupLink}
			>
				サインアップ
			</Link>
		</p>
	);
}

export function SigninForm() {
	const { form, onSubmit, submitError } = useSigninForm();

	return (
		<div className="space-y-6">
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<EmailField
					register={form.register}
					error={form.formState.errors.email?.message}
					disabled={form.formState.isSubmitting}
				/>
				<PasswordField
					register={form.register}
					error={form.formState.errors.password?.message}
					disabled={form.formState.isSubmitting}
				/>
				{submitError && <ErrorMessage error={submitError} />}
				<SubmitButton disabled={form.formState.isSubmitting} />
			</form>
			<SuggestSignupSection />
		</div>
	);
}
