"use server";

import { signout } from "@/features/shared/api/generated/functions";
import { COOKIE_KEYS, ROUTES } from "@/features/shared/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signoutAction() {
  const cookieStore = await cookies();

  try {
    const accessTokenCookie = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN);

    if (accessTokenCookie) {
      await signout({
        headers: {
          Cookie: `${accessTokenCookie.name}=${accessTokenCookie.value}`,
        },
      });
    }
  } catch (error) {
    console.error("Signout API call failed:", error);
  }

  cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);

  redirect(ROUTES.SIGNIN);
}
