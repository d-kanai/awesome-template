/**
 * MSW Browser Setup
 * ブラウザ環境（開発環境・Storybook）でAPIをモックするためのMSW worker
 */
import { setupWorker } from "msw/browser";

/**
 * MSWを起動する
 * 開発環境のみで実行されるべき
 *
 * Note: 動的importを使用してServer Component専用モジュールの読み込みを回避
 */
export async function startMockServiceWorker() {
  if (process.env.NODE_ENV === "development") {
    // 動的importでMSWハンドラーを読み込む
    const { getTemporaryAPIForFigmaImportMock } = await import(
      "../generated/tmp-functions"
    );

    const worker = setupWorker(...getTemporaryAPIForFigmaImportMock());

    await worker.start({
      onUnhandledRequest: "bypass", // モックされていないリクエストは通過させる
    });
    console.log("[MSW] Mock Service Worker started");
  }
}
