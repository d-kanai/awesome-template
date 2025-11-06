"use server";

import { type SignupFormData, signupFormSchema } from "@/features/auth/schemas";
import { signup as signupApi } from "@/features/shared/api/generated/functions";
import { ROUTES } from "@/features/shared/lib/constants";
import { formatZodFieldErrors } from "@/features/shared/lib/formHelpers";

export type SignupActionResponse = {
  error?: string;
  fieldErrors?: Partial<Record<keyof SignupFormData, string[]>>;
  success?: boolean;
  redirectTo?: string;
};

export async function signupAction(
  data: SignupFormData,
): Promise<SignupActionResponse> {
  const validatedData = signupFormSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      fieldErrors: formatZodFieldErrors<SignupFormData>(
        validatedData.error.errors,
      ),
    };
  }

  try {
    await signupApi(validatedData.data);
    return { success: true, redirectTo: ROUTES.SIGNIN };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
