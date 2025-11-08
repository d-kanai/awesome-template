"use client";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { Button } from "@/features/shared/figma_generated/Button";
import { InputField } from "@/features/shared/figma_generated/InputField";
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
    <InputField
      id="signup-email"
      data-testid={SignupTestIds.emailInput}
      hasLabel
      label="メールアドレス"
      type="email"
      valueType="placeholder"
      value="email@example.com"
      state={error ? "error" : disabled ? "disabled" : "default"}
      disabled={disabled}
      hasError={!!error}
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
    <InputField
      id="signup-password"
      data-testid={SignupTestIds.passwordInput}
      hasLabel
      label="パスワード"
      type="password"
      valueType="placeholder"
      value="8文字以上"
      state={error ? "error" : disabled ? "disabled" : "default"}
      disabled={disabled}
      hasError={!!error}
      error={error}
      {...register("password")}
    />
  );
}

function ErrorMessage({ error }: { error: string }) {
  return (
    <div
      className="rounded-md bg-destructive/10 p-Space-400"
      data-testid={SignupTestIds.errorMessage}
    >
      <p className="text-body-small text-destructive">{error}</p>
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <Button
      type="submit"
      variant="primary"
      size="medium"
      state={disabled ? "disabled" : "default"}
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
    <p className="text-center text-body-small text-foreground-secondary">
      すでにアカウントをお持ちですか？{" "}
      <Link
        href={AUTH_ROUTES.SIGNIN}
        className="font-medium text-primary hover:text-primary/80"
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
      <SuggestSigninSection />
    </div>
  );
}
