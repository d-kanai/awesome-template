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
			className="rounded-md bg-sds_light-Background-Danger-Tertiary p-Space-400"
			data-testid={SigninTestIds.errorMessage}
		>
			<p className="text-sm text-sds_light-Text-Danger-Default">{error}</p>
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
		<p className="text-center text-sm text-sds_light-Text-Default-Secondary">
			アカウントをお持ちでないですか？{" "}
			<Link
				href={AUTH_ROUTES.SIGNUP}
				className="font-medium text-sds_light-Text-Brand-Default hover:text-sds_light-Text-Brand-Secondary"
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
		<div className="space-y-Space-600">
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-Space-600"
			>
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
