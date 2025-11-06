"use server";

import { signup as signupApi } from "@/features/shared/api/generated/functions";
import type { SignupRequest } from "@/features/shared/api/generated/model";
import { ROUTES } from "@/features/shared/lib/constants";

export type SignupActionState = {
  error?: string;
  success?: boolean;
  redirectTo?: string;
};

export async function signupAction(
  prevState: SignupActionState | undefined,
  formData: FormData,
): Promise<SignupActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してください" };
  }

  try {
    const requestData: SignupRequest = { email, password };
    const response = await signupApi(requestData);

    if (response.status === 200 || response.status === 201) {
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
