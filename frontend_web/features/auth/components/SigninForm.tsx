"use client";

import { Button } from "@/features/shared/figma_generated/Button";
import { TextField } from "@/features/shared/components/TextField";
import { ROUTES } from "@/features/shared/lib/constants";
import Link from "next/link";
import { useSigninForm } from "../hooks/useSigninForm";

export function SigninForm() {
  const { form, onSubmit, submitError } = useSigninForm();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <TextField
        id="signin-email"
        label="メールアドレス"
        type="email"
        placeholder="email@example.com"
        disabled={isSubmitting}
        error={errors.email?.message}
        {...register("email")}
      />

      <TextField
        id="signin-password"
        label="パスワード"
        type="password"
        placeholder="パスワード"
        disabled={isSubmitting}
        error={errors.password?.message}
        {...register("password")}
      />

      {submitError && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "サインイン中..." : "サインイン"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        アカウントをお持ちでないですか？{" "}
        <Link
          href={ROUTES.SIGNUP}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          サインアップ
        </Link>
      </p>
    </form>
  );
}
