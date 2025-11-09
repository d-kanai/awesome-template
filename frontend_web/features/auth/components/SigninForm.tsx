"use client";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { Button } from "@/features/shared/figma_generated/Button";
import { InputField } from "@/features/shared/figma_generated/InputField";
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
      label="メールアドレス"
      type="email"
      placeholder="email@example.com"
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
      label="パスワード"
      type="password"
      placeholder="パスワード"
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
    <Button
      type="submit"
      variant="primary"
      size="medium"
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
