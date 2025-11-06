"use server";

import { type SigninFormData, signinFormSchema } from "@/features/auth/schemas";
import { signin as signinApi } from "@/features/shared/api/generated/functions";
import { COOKIE_KEYS, ROUTES } from "@/features/shared/lib/constants";
import { formatZodFieldErrors } from "@/features/shared/lib/formHelpers";
import { cookies } from "next/headers";

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
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }

    return { success: true, redirectTo: ROUTES.USER_LIST };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
