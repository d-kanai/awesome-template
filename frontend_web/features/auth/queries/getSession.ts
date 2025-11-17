"use server";

import { cache } from "react";
import { me } from "@/features/shared/api/generated/functions";
import { CookieManager } from "@/features/shared/lib/cookieManager";
import { createLoggerAsync } from "@/features/shared/lib/logger";

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
    const logger = await createLoggerAsync();
    logger.info({
      type: "info",
      message: "Session validation failed",
      error,
    });
    return { user: null, isAuthenticated: false };
  }
});
