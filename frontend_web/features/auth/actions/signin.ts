"use server";

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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してください" };
  }

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
