"use client";

import { useEffect, useState } from "react";

/**
 * MSW Provider
 * 開発環境でMock Service Workerを初期化します
 *
 * Note: MSWはブラウザ環境でのみ動作します（vitest環境では不使用）
 */
export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const initMSW = async () => {
      if (
        process.env.NODE_ENV === "development" &&
        process.env.NEXT_PUBLIC_API_MOCKING === "enabled"
      ) {
        const { startMockServiceWorker } = await import(
          "@/features/shared/api/mocks/browser"
        );
        await startMockServiceWorker();
      }
      setMswReady(true);
    };

    initMSW();
  }, []);

  // MSWの準備が完了するまで何も表示しない（開発環境のみ）
  if (
    !mswReady &&
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_API_MOCKING === "enabled"
  ) {
    return null;
  }

  return <>{children}</>;
}
