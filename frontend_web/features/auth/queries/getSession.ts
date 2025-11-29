"use server";

import { cache } from "react";
import { me } from "@/shared/api/generated/functions";
import { CookieManager } from "@/shared/lib/cookieManager";

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
  } catch {
    // エラーログはfetcher層で既に記録済み（stack traceにこのQueryの情報が含まれる）
    return { user: null, isAuthenticated: false };
  }
});
