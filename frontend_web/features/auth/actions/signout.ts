"use server";

import { COOKIE_KEYS, ROUTES } from "@/features/shared/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);

  redirect(ROUTES.SIGNIN);
}
