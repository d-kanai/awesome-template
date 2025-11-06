"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { API_BASE_URL, COOKIE_KEYS } from "@/features/shared/lib/constants";

export type Session = {
  user: { id: string; email: string; createdAt?: string; updatedAt?: string } | null;
  isAuthenticated: boolean;
};

export const getSession = cache(async (): Promise<Session> => {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN);

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
