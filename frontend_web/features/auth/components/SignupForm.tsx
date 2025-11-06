"use client";

import { Button } from "@/features/shared/figma_generated/Button";
import { Input } from "@/features/shared/figma_generated/Input";
import { Label } from "@/features/shared/figma_generated/Label";
import Link from "next/link";
import { useSignupForm } from "../hooks/useSignupForm";

export function SignupForm() {
  const { form, isPending, error, schema } = useSignupForm();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.Field
        name="email"
        validators={{
          onChange: schema.shape.email,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="signup-email">メールアドレス</Label>
            <Input
              id="signup-email"
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

      <form.Field
        name="password"
        validators={{
          onChange: schema.shape.password,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="signup-password">パスワード</Label>
            <Input
              id="signup-password"
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={isPending}
              placeholder="8文字以上"
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

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "登録中..." : "サインアップ"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        すでにアカウントをお持ちですか？{" "}
        <Link
          href="/auth/signin"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          サインイン
        </Link>
      </p>
    </form>
  );
}
