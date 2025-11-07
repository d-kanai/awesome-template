"use server";

import { AUTH_ROUTES } from "@/features/auth/routes";
import { CookieManager } from "@/features/shared/lib/cookieManager";
import { redirect } from "next/navigation";

export async function signoutAction() {
  await CookieManager.deleteAccessToken();

  redirect(AUTH_ROUTES.SIGNIN);
}
