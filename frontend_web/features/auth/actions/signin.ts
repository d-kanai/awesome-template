"use server";

import { signinFormSchema } from "@/features/auth/schemas";
import { signin as signinApi } from "@/features/shared/api/generated/functions";
import type { SigninRequest } from "@/features/shared/api/generated/model";
import { ROUTES } from "@/features/shared/lib/constants";

export type SigninActionState = {
  error?: string;
  success?: boolean;
  redirectTo?: string;
};

export async function signinAction(
  prevState: SigninActionState | undefined,
  formData: FormData,
): Promise<SigninActionState> {
  // FormDataから値を抽出
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = signinFormSchema.safeParse(rawData);

  if (!result.success) {
    return {
      error: result.error.errors[0]?.message || "入力エラーが発生しました",
    };
  }

  const { email, password } = result.data;

  try {
    const requestData: SigninRequest = { email, password };
    const response = await signinApi(requestData);

    if (response.status === 200) {
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
