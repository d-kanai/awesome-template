import { signupAction } from "@/features/auth/actions/signup";
import { type SignupFormData, signupFormSchema } from "@/features/auth/schemas";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";

export function useSignupForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as SignupFormData,
    onSubmit: async ({ value, formApi }) => {
      const result = await signupAction(value);

      if (result.error) {
        formApi.setErrorMap({
          onSubmit: result.error as never,
        });
        return;
      }

      if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    },
  });

  return {
    form,
    schema: signupFormSchema,
  };
}
