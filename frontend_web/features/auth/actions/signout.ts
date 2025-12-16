"use server";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { CookieManager } from "@/shared/lib/cookieManager";

export type SignoutActionResponse = {
  success: boolean;
  redirectTo: string;
};

/**
 * サインアウトアクション
 *
 * Cookie内のアクセストークンを削除し、サインインページへのリダイレクトURLを返す
 * クライアント側でuseAuthStore.logout()も呼び出す必要がある
 */
export async function signoutAction(): Promise<SignoutActionResponse> {
  // Cookieからアクセストークンを削除
  await CookieManager.deleteAccessToken();

  return {
    success: true,
    redirectTo: AUTH_ROUTES.SIGNIN,
  };
}
