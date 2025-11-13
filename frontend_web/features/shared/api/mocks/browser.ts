/**
 * MSW Browser Setup
 * ブラウザ環境（開発環境・Storybook）でAPIをモックするためのMSW worker
 */
import { setupWorker } from "msw/browser";
import { getTemporaryAPIForFigmaImportMock } from "../generated/tmp-functions";

/**
 * MSW worker instance
 * 開発環境でバックエンドAPIをモックします
 */
export const worker = setupWorker(...getTemporaryAPIForFigmaImportMock());

/**
 * MSWを起動する
 * 開発環境のみで実行されるべき
 */
export async function startMockServiceWorker() {
  if (process.env.NODE_ENV === "development") {
    await worker.start({
      onUnhandledRequest: "bypass", // モックされていないリクエストは通過させる
    });
    console.log("[MSW] Mock Service Worker started");
  }
}
