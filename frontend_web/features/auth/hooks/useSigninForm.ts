import { signinAction } from "@/features/auth/actions/signin";
import { type SigninFormData, signinFormSchema } from "@/features/auth/schemas";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";

export function useSigninForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as SigninFormData,
    onSubmit: async ({ value, formApi }) => {
      const result = await signinAction(value);

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
    schema: signinFormSchema,
  };
}
