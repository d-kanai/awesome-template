import { useSignup } from "@/features/shared/api/generated";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { type SignupFormData, signupSchema } from "../schemas/authSchema";

/**
 * useSignupForm
 * サインアップフォームの状態管理とバリデーション
 */
export function useSignupForm() {
  const router = useRouter();

  const signupMutation = useSignup({
    mutation: {
      onSuccess: () => {
        // サインアップ成功後、サインイン画面に遷移
        console.log("[useSignupForm] Signup success, navigating to signin");
        router.push("/auth/signin");
      },
      onError: (error) => {
        console.error("[useSignupForm] Signup error:", error);
      },
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as SignupFormData,
    onSubmit: async ({ value }) => {
      await signupMutation.mutateAsync({ data: value });
    },
  });

  return {
    form,
    isPending: signupMutation.isPending,
    error: signupMutation.error,
    schema: signupSchema,
  };
}
