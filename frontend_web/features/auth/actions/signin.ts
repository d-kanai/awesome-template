"use server";

import { redirect } from "next/navigation";
import { signin as signinApi } from "@/features/shared/api/generated/functions";
import type { SigninRequest } from "@/features/shared/api/generated/model";

export type SigninActionState = {
  error?: string;
  success?: boolean;
};

/**
 * Server Action: サインイン処理
 * - Orval生成のsignin関数を呼び出し
 * - バックエンドがSet-CookieヘッダーでhttpOnly Cookieを設定
 * - 成功時は/userページにリダイレクト
 */
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
      // バックエンドがSet-CookieヘッダーでhttpOnly Cookieを設定
      // Next.jsが自動的にCookieを保存
      redirect("/user");
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
