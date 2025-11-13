"use server";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { CookieManager } from "@/features/shared/lib/cookieManager";

export type SignoutActionResponse = {
  success?: boolean;
  redirectTo?: string;
};

export async function signoutAction(): Promise<SignoutActionResponse> {
  await CookieManager.deleteAccessToken();

  return { success: true, redirectTo: AUTH_ROUTES.SIGNIN };
}
