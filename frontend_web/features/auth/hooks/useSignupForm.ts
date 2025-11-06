import { signupAction } from "@/features/auth/actions/signup";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type SignupFormData, signupSchema } from "../schemas/authSchema";

/**
 * useSignupForm
 * サインアップフォームの状態管理とバリデーション
 * - TanStack Formでバリデーション
 * - Server Actionでサインアップ処理
 */
export function useSignupForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as SignupFormData,
    onSubmit: async ({ value }) => {
      setIsPending(true);
      setError(null);

      try {
        // FormDataを作成してServer Actionに渡す
        const formData = new FormData();
        formData.append("email", value.email);
        formData.append("password", value.password);

        const result = await signupAction(undefined, formData);

        if (result.error) {
          setError(result.error);
        } else if (result.redirectTo) {
          // 成功時はクライアント側でリダイレクト
          router.push(result.redirectTo);
        }
      } catch (err) {
        console.error("[useSignupForm] Signup error:", err);
        setError(
          err instanceof Error ? err.message : "サインアップに失敗しました",
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
    schema: signupSchema,
  };
}
