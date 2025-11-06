import { signinAction } from "@/features/auth/actions/signin";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const signinSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

type SigninFormData = z.infer<typeof signinSchema>;

export function useSigninForm() {
  const router = useRouter();
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
        const formData = new FormData();
        formData.append("email", value.email);
        formData.append("password", value.password);

        const result = await signinAction(undefined, formData);

        if (result.error) {
          setError(result.error);
        } else if (result.redirectTo) {
          router.push(result.redirectTo);
        }
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
