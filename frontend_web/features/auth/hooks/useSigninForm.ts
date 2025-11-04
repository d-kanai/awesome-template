import { useSignin } from "@/features/shared/api/generated";
import { useAuth } from "@/features/shared/providers/AuthProvider";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { type SigninFormData, signinSchema } from "../schemas/authSchema";

/**
 * useSigninForm
 * サインインフォームの状態管理とバリデーション
 */
export function useSigninForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  const signinMutation = useSignin({
    mutation: {
      onSuccess: () => {
        // サインイン成功後、認証状態を更新してユーザー画面に遷移
        console.log("[useSigninForm] Signin success, navigating to user page");
        signIn();
        router.push("/user");
      },
      onError: (error) => {
        console.error("[useSigninForm] Signin error:", error);
      },
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as SigninFormData,
    onSubmit: async ({ value }) => {
      await signinMutation.mutateAsync({ data: value });
    },
  });

  return {
    form,
    isPending: signinMutation.isPending,
    error: signinMutation.error,
    schema: signinSchema,
  };
}
