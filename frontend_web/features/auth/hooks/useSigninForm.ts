import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signinAction } from "@/features/auth/actions/signin";
import {
  type SigninFormData,
  signinFormDefaults,
  signinFormSchema,
} from "@/features/auth/schemas";

export function useSigninForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<SigninFormData>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: signinFormDefaults,
    mode: "onBlur",
  });

  const onSubmit = async (data: SigninFormData) => {
    setSubmitError(null);
    const result = await signinAction(data);

    if (result.error) {
      setSubmitError(result.error);
      return;
    }

    if (result.redirectTo) {
      router.push(result.redirectTo);
    }
  };

  return {
    form,
    onSubmit,
    submitError,
  };
}
