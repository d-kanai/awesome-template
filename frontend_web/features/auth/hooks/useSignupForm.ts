import { signupAction } from "@/features/auth/actions/signup";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const signupSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .max(100, "パスワードは100文字以内で入力してください"),
});

type SignupFormData = z.infer<typeof signupSchema>;

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
        const formData = new FormData();
        formData.append("email", value.email);
        formData.append("password", value.password);

        const result = await signupAction(undefined, formData);

        if (result.error) {
          setError(result.error);
        } else if (result.redirectTo) {
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
