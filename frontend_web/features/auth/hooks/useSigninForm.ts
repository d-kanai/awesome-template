import { signinAction } from "@/features/auth/actions/signin";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { type SigninFormData, signinSchema } from "../schemas/authSchema";

/**
 * useSigninForm
 * サインインフォームの状態管理とバリデーション
 * - TanStack Formでバリデーション
 * - Server Actionでサインイン処理
 */
export function useSigninForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as SigninFormData,
    onSubmit: async ({ value }) => {
      setIsPending(true);
      setError(null);

      try {
        // FormDataを作成してServer Actionに渡す
        const formData = new FormData();
        formData.append("email", value.email);
        formData.append("password", value.password);

        const result = await signinAction(undefined, formData);

        if (result.error) {
          setError(result.error);
        }
        // 成功時はServer Action内でredirect()されるので、ここでは何もしない
      } catch (err) {
        console.error("[useSigninForm] Signin error:", err);
        setError(
          err instanceof Error ? err.message : "サインインに失敗しました",
        );
      } finally {
        setIsPending(false);
      }
    },
  });

  return {
    form,
    isPending,
    error,
    schema: signinSchema,
  };
}
