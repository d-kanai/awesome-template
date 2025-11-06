"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL, COOKIE_KEYS, ROUTES } from "@/features/shared/lib/constants";

export async function signoutAction() {
  const cookieStore = await cookies();

  // バックエンドにサインアウトリクエストを送信（Cookieを削除）
  try {
    const accessTokenCookie = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN);

    if (accessTokenCookie) {
      await fetch(`${API_BASE_URL}/auth/signout`, {
        method: "POST",
        headers: {
          Cookie: `${accessTokenCookie.name}=${accessTokenCookie.value}`,
        },
        credentials: "include",
      });
    }
  } catch (error) {
    console.error("Signout API call failed:", error);
  }

  // ローカルのCookieも削除
  cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);

  redirect(ROUTES.SIGNIN);
}
