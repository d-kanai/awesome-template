"use server";

import { me } from "@/features/shared/api/generated/functions";
import { COOKIE_KEYS } from "@/features/shared/lib/constants";
import { cookies } from "next/headers";
import { cache } from "react";

export type Session = {
  user: {
    id?: string;
    email?: string;
  } | null;
  isAuthenticated: boolean;
};

export const getSession = cache(async (): Promise<Session> => {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN);

  if (!accessTokenCookie) {
    return { user: null, isAuthenticated: false };
  }

  try {
    const response = await me({
      headers: {
        Cookie: `${accessTokenCookie.name}=${accessTokenCookie.value}`,
      },
      cache: "no-store",
    });

    if (response.status === 200) {
      return { user: response.data, isAuthenticated: true };
    }

    return { user: null, isAuthenticated: false };
  } catch (error) {
    console.error("Session validation failed:", error);
    return { user: null, isAuthenticated: false };
  }
});
