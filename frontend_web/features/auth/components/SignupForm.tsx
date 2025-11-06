"use client";

import { Button } from "@/features/shared/figma_generated/Button";
import { TextField } from "@/features/shared/components/TextField";
import { ROUTES } from "@/features/shared/lib/constants";
import Link from "next/link";
import { useSignupForm } from "../hooks/useSignupForm";

export function SignupForm() {
  const { form, onSubmit, submitError } = useSignupForm();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <TextField
        id="signup-email"
        label="メールアドレス"
        type="email"
        placeholder="email@example.com"
        disabled={isSubmitting}
        error={errors.email?.message}
        {...register("email")}
      />

      <TextField
        id="signup-password"
        label="パスワード"
        type="password"
        placeholder="8文字以上"
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
        {isSubmitting ? "登録中..." : "サインアップ"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        すでにアカウントをお持ちですか？{" "}
        <Link
          href={ROUTES.SIGNIN}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          サインイン
        </Link>
      </p>
    </form>
  );
}
