"use client";

import Link from "next/link";
import { AUTH_ROUTES } from "@/features/auth/routes";
import { Button } from "@/shared/ui/atoms/Button/Button";
import { InputField } from "@/shared/ui/atoms/InputField/InputField";
import { useSigninForm } from "../hooks/useSigninForm";
import { SigninButtonIds, SigninTestIds } from "../ids";

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
      className="rounded-[var(--sds-size-radius-200,8px)] bg-[#fee2e2] p-[var(--sds-size-space-400,16px)]"
      data-testid={SigninTestIds.errorMessage}
    >
      <p className="font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] text-[length:var(--sds-typography-body-size-small,14px)] leading-[1.4] text-[color:var(--sds-color-text-danger-default,#900b09)]">
        {error}
      </p>
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <Button
      id={SigninButtonIds.submit}
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
    <p className="text-center font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] text-[length:var(--sds-typography-body-size-small,14px)] leading-[1.4] text-[color:var(--sds-color-text-default-secondary,#757575)]">
      アカウントをお持ちでないですか？{" "}
      <Link
        href={AUTH_ROUTES.SIGNUP}
        className="font-[var(--sds-typography-body-font-weight-strong,600)] text-[color:var(--sds-color-text-brand-on-brand-tertiary,#2c2c2c)] hover:text-[color:var(--sds-color-text-default-default,#1e1e1e)]"
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
    <div className="flex flex-col gap-[var(--sds-size-space-600,24px)]">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-[var(--sds-size-space-600,24px)]"
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
