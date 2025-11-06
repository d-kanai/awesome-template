"use server";

import { type SigninFormData, signinFormSchema } from "@/features/auth/schemas";
import { signin as signinApi } from "@/features/shared/api/generated/functions";
import { ROUTES } from "@/features/shared/lib/constants";
import { extractFormData } from "@/features/shared/lib/formHelpers";
import { isSuccessStatus } from "@/features/shared/lib/http";

export type SigninActionState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof SigninFormData, string[]>>;
  success?: boolean;
  redirectTo?: string;
};

export async function signinAction(
  formData: FormData,
): Promise<SigninActionState> {
  const validatedFormData = extractFormData(signinFormSchema, formData);

  if (!validatedFormData.success) {
    return {
      fieldErrors: validatedFormData.fieldErrors,
    };
  }

  try {
    const response = await signinApi(validatedFormData.data);

    if (isSuccessStatus(response.status)) {
      return { success: true, redirectTo: ROUTES.USER_LIST };
    }

    return { error: "サインインに失敗しました" };
  } catch (error) {
    console.error("Signin error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "サインインに失敗しました" };
  }
}
