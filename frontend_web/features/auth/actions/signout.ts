"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/**
 * Server Action: サインアウト処理
 * - バックエンドの /auth/signout エンドポイントを呼び出してCookieを削除
 * - /auth/signinページにリダイレクト
 */
export async function signoutAction() {
  const cookieStore = await cookies();

  // バックエンドにサインアウトリクエストを送信（Cookieを削除）
  try {
    const accessTokenCookie = cookieStore.get("accessToken");

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
  cookieStore.delete("accessToken");

  redirect("/auth/signin");
}
