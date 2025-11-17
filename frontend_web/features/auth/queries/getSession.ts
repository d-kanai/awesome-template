"use server";

import { me } from "@/features/shared/api/generated/functions";
import { CookieManager } from "@/features/shared/lib/cookieManager";
import { info as logInfo } from "@/features/shared/lib/logger";
import { cache } from "react";

export type Session = {
  user: {
    id?: string;
    email?: string;
  } | null;
  isAuthenticated: boolean;
};

export const getSession = cache(async (): Promise<Session> => {
  const accessToken = await CookieManager.getAccessToken();

  if (!accessToken) {
    return { user: null, isAuthenticated: false };
  }

  try {
    const response = await me({
      cache: "no-store",
    });

    if (response.status === 200) {
      return { user: response.data, isAuthenticated: true };
    }

    return { user: null, isAuthenticated: false };
  } catch (error) {
    await logInfo("Session validation failed", { error });
    return { user: null, isAuthenticated: false };
  }
});
