"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HOME_ROUTES } from "@/features/home/routes";

function ScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--sds-color-background-default-secondary,#f5f5f5)]">
      <div className="flex flex-1 items-center justify-center p-[var(--sds-size-space-600,24px)]">
        {children}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="text-center">
      <div className="mb-[var(--sds-size-space-400,16px)]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      </div>
      <p className="font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] text-[length:var(--sds-typography-body-size-medium,16px)] leading-[1.4] text-[color:var(--sds-color-text-default-secondary,#757575)]">
        リダイレクト中...
      </p>
    </div>
  );
}

/**
 * Auth Callback Screen
 *
 * OTP認証では不要だが、互換性のため残す。
 * アクセスされた場合はホームまたはサインインにリダイレクト。
 */
export function CallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    // OTP認証ではcallbackは使用しないため、適切なページにリダイレクト
    // Cookie（accessToken）があればホームへ、なければサインインへ
    router.replace(HOME_ROUTES.HOME);
  }, [router]);

  return (
    <ScreenContainer>
      <LoadingState />
    </ScreenContainer>
  );
}
