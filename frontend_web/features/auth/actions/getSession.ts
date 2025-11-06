"use server";

import { cache } from "react";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export type Session = {
  user: { id: string; email: string; createdAt?: string; updatedAt?: string } | null;
  isAuthenticated: boolean;
};

/**
 * Server Action: セッション情報を取得
 * - httpOnly Cookieの存在をチェック
 * - バックエンドの /auth/me エンドポイントを呼び出してユーザー情報を取得
 */
export const getSession = cache(async (): Promise<Session> => {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get("accessToken");

  if (!accessTokenCookie) {
    return { user: null, isAuthenticated: false };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Cookie: `${accessTokenCookie.name}=${accessTokenCookie.value}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (response.ok) {
      const user = await response.json();
      return { user, isAuthenticated: true };
    }

    return { user: null, isAuthenticated: false };
  } catch (error) {
    console.error("Session validation failed:", error);
    return { user: null, isAuthenticated: false };
  }
});
