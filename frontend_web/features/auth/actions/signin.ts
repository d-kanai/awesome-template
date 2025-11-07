"use server";

import { type SigninFormData, signinFormSchema } from "@/features/auth/schemas";
import { signin as signinApi } from "@/features/shared/api/generated/functions";
import { CookieManager } from "@/features/shared/lib/cookieManager";
import { formatZodFieldErrors } from "@/features/shared/validation/zodErrorFormatter";
import { USER_ROUTES } from "@/features/user/routes";

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
    const response = await signinApi(validatedData.data);
    const accessToken = response.data?.accessToken;

    if (accessToken) {
      await CookieManager.setAccessToken(accessToken);
    }

    return { success: true, redirectTo: USER_ROUTES.USER_LIST };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
