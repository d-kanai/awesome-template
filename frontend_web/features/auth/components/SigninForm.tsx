"use client";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { InputField } from "@/features/shared/figma_generated/InputField";
import { ButtonNew } from "@/features/shared/figma_generated/ButtonNew";
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
    <InputField
      id="signin-email"
      data-testid={SigninTestIds.emailInput}
      hasLabel
      label="メールアドレス"
      type="email"
      placeholder="email@example.com"
      valueType="placeholder"
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
  register: ReturnType<typeof useSigninForm>["form"]["register"];
  error?: string;
  disabled: boolean;
}) {
  return (
    <InputField
      id="signin-password"
      data-testid={SigninTestIds.passwordInput}
      hasLabel
      label="パスワード"
      type="password"
      placeholder="パスワード"
      valueType="placeholder"
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
      data-testid={SigninTestIds.errorMessage}
    >
      <p className="text-body-small text-destructive">{error}</p>
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <ButtonNew
      type="submit"
      variant="primary"
      size="medium"
      state={disabled ? "disabled" : "default"}
      disabled={disabled}
      className="w-full"
      data-testid={SigninTestIds.submitButton}
    >
      サインイン
    </ButtonNew>
  );
}

function SuggestSignupSection() {
  return (
    <p className="text-center text-body-small text-foreground-secondary">
      アカウントをお持ちでないですか？{" "}
      <Link
        href={AUTH_ROUTES.SIGNUP}
        className="font-medium text-primary hover:text-primary/80"
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
