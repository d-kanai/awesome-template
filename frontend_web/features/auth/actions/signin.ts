"use server";

import { type SigninFormData, signinFormSchema } from "@/features/auth/schemas";
import { signin as signinApi } from "@/features/shared/api/generated/functions";
import { ROUTES } from "@/features/shared/lib/constants";
import { formatZodFieldErrors } from "@/features/shared/lib/formHelpers";

export type SigninActionResponse = {
  error?: string;
  fieldErrors?: Partial<Record<keyof SigninFormData, string[]>>;
  success?: boolean;
  redirectTo?: string;
};

export async function signinAction(
  data: SigninFormData,
): Promise<SigninActionResponse> {
  const validatedData = signinFormSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      fieldErrors: formatZodFieldErrors<SigninFormData>(
        validatedData.error.errors,
      ),
    };
  }

  try {
    await signinApi(validatedData.data);
    return { success: true, redirectTo: ROUTES.USER_LIST };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
