import { signupAction } from "@/features/auth/actions/signup";
import {
  type SignupFormData,
  signupFormSchema,
  signupFormDefaults,
} from "@/features/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

export function useSignupForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: signupFormDefaults,
    mode: "onBlur",
  });

  const onSubmit = async (data: SignupFormData) => {
    setSubmitError(null);
    const result = await signupAction(data);

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
