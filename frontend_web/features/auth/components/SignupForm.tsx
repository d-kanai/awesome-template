"use client";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { TextField } from "@/features/shared/components/TextField";
import { Button } from "@/features/shared/figma_generated/Button";
import Link from "next/link";
import { useSignupForm } from "../hooks/useSignupForm";
import { SignupTestIds } from "../test-ids";

function EmailField({
	register,
	error,
	disabled,
}: {
	register: ReturnType<typeof useSignupForm>["form"]["register"];
	error?: string;
	disabled: boolean;
}) {
	return (
		<TextField
			id="signup-email"
			data-testid={SignupTestIds.emailInput}
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
	register: ReturnType<typeof useSignupForm>["form"]["register"];
	error?: string;
	disabled: boolean;
}) {
	return (
		<TextField
			id="signup-password"
			data-testid={SignupTestIds.passwordInput}
			label="パスワード"
			type="password"
			placeholder="8文字以上"
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
			data-testid={SignupTestIds.errorMessage}
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
			data-testid={SignupTestIds.submitButton}
		>
			サインアップ
		</Button>
	);
}

function SuggestSigninSection() {
	return (
		<p className="text-center text-sm text-gray-600">
			すでにアカウントをお持ちですか？{" "}
			<Link
				href={AUTH_ROUTES.SIGNIN}
				className="font-medium text-blue-600 hover:text-blue-500"
				data-testid={SignupTestIds.signinLink}
			>
				サインイン
			</Link>
		</p>
	);
}

export function SignupForm() {
	const { form, onSubmit, submitError } = useSignupForm();

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
			<SuggestSigninSection />
		</div>
	);
}
