"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AUTH_ROUTES } from "../routes";

/**
 * SignupScreen
 *
 * Passwordless認証ではSignin = Signupのため、
 * SigninScreenにリダイレクトする。
 */
export function SignupScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace(AUTH_ROUTES.SIGNIN);
  }, [router]);

  return null;
}
