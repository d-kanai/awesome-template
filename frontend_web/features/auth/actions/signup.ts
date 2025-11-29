"use server";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { type SignupFormData, signupFormSchema } from "@/features/auth/schemas";
import { signup as signupApi } from "@/shared/api/generated/functions";
import { formatZodFieldErrors } from "@/shared/lib/zodErrorFormatter";

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
    return { success: true, redirectTo: AUTH_ROUTES.SIGNIN };
  } catch (error) {
    // エラーログはfetcher層で既に記録済み（stack traceにこのServer Actionの情報が含まれる）
    return { error: (error as Error).message };
  }
}
