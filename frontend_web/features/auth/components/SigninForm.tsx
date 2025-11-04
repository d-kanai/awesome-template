"use client";

import { Button } from "@/features/shared/figma_generated/Button";
import { Input } from "@/features/shared/figma_generated/Input";
import { Label } from "@/features/shared/figma_generated/Label";
import Link from "next/link";
import { useSigninForm } from "../hooks/useSigninForm";

/**
 * SigninForm コンポーネント
 * サインインフォームUI
 */
export function SigninForm() {
  const { form, isPending, error, schema } = useSigninForm();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Email */}
      <form.Field
        name="email"
        validators={{
          onChange: schema.shape.email,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="signin-email">メールアドレス</Label>
            <Input
              id="signin-email"
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={isPending}
              placeholder="email@example.com"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-600">
                {String(
                  field.state.meta.errors[0]?.message ||
                    field.state.meta.errors[0],
                )}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Password */}
      <form.Field
        name="password"
        validators={{
          onChange: schema.shape.password,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="signin-password">パスワード</Label>
            <Input
              id="signin-password"
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={isPending}
              placeholder="パスワード"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-600">
                {String(
                  field.state.meta.errors[0]?.message ||
                    field.state.meta.errors[0],
                )}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {error instanceof Error ? error.message : "エラーが発生しました"}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "サインイン中..." : "サインイン"}
      </Button>

      {/* Link to Signup */}
      <p className="text-center text-sm text-gray-600">
        アカウントをお持ちでないですか？{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          サインアップ
        </Link>
      </p>
    </form>
  );
}
