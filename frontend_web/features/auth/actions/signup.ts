"use server";

import { type SignupFormData, signupFormSchema } from "@/features/auth/schemas";
import { signup as signupApi } from "@/features/shared/api/generated/functions";
import { ROUTES } from "@/features/shared/lib/constants";
import { extractFormData } from "@/features/shared/lib/formHelpers";
import { isSuccessStatus } from "@/features/shared/lib/http";

export type SignupActionState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof SignupFormData, string[]>>;
  success?: boolean;
  redirectTo?: string;
};

export async function signupAction(
  formData: FormData,
): Promise<SignupActionState> {
  const validatedFormData = extractFormData(signupFormSchema, formData);

  if (!validatedFormData.success) {
    return {
      fieldErrors: validatedFormData.fieldErrors,
    };
  }

  try {
    const response = await signupApi(validatedFormData.data);

    if (isSuccessStatus(response.status)) {
      return { success: true, redirectTo: ROUTES.SIGNIN };
    }

    return { error: "サインアップに失敗しました" };
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "サインアップに失敗しました" };
  }
}
