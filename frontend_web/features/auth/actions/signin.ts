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
    const { createLoggerAsync } = await import("@/features/shared/lib/logger");
    const logger = await createLoggerAsync();
    logger.error(
      {
        err: error,
        type: "server_action_error",
        action: "signin",
        email: validatedData.data.email,
      },
      "Signin action failed",
    );
    return { error: (error as Error).message };
  }
}
