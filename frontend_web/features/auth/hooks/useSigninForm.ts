import { signinAction } from "@/features/auth/actions/signin";
import { type SigninFormData, signinFormSchema } from "@/features/auth/schemas";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

        const result = await signinAction(formData);

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
    schema: signinFormSchema,
  };
}
