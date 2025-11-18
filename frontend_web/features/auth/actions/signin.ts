"use server";

import { type SigninFormData, signinFormSchema } from "@/features/auth/schemas";
import { signin as signinApi } from "@/features/shared/api/generated/functions";
import { CookieManager } from "@/features/shared/lib/cookieManager";
import { formatZodFieldErrors } from "@/features/shared/lib/zodErrorFormatter";
import { USER_ROUTES } from "@/features/user/routes";

export type SigninActionResponse = {
  error?: string;
  fieldErrors?: Partial<Record<keyof SigninFormData, string[]>>;
  success?: boolean;
  redirectTo?: string;
  user?: {
    id: string;
    email: string;
  };
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
    const user =
      response.data?.id && response.data?.email
        ? {
            id: response.data.id,
            email: response.data.email,
          }
        : undefined;

    if (accessToken) {
      await CookieManager.setAccessToken(accessToken);
    }

    return { success: true, redirectTo: USER_ROUTES.USER_LIST, user };
  } catch (error) {
    // エラーログはfetcher層で既に記録済み（stack traceにこのServer Actionの情報が含まれる）
    return { error: (error as Error).message };
  }
}
