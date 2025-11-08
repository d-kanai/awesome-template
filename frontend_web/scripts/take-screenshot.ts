import { chromium } from "@playwright/test";
import { API_BASE_URL } from "../features/shared/api/config";
import { CookieManager } from "../features/shared/lib/cookieManager";
import { USER_ROUTES } from "../features/user/routes";

async function takeScreenshot() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: "http://localhost:3001",
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  // 認証トークンを取得
  const response = await fetch(`${API_BASE_URL}/e2e/dummy_token`, {
    method: "POST",
  });
  const data = await response.json();
  const accessToken = data.token;

  // Cookieを設定
  await context.addCookies([
    {
      name: CookieManager.KEYS.ACCESS_TOKEN,
      value: accessToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  // ユーザーリスト画面にアクセス
  await page.goto(`http://localhost:3001${USER_ROUTES.USER_LIST}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000); // 描画待機

  // スクリーンショット撮影
  await page.screenshot({
    path: "user-list-screenshot.png",
    fullPage: true,
  });

  console.log("✅ Screenshot saved: user-list-screenshot.png");

  await browser.close();
}

takeScreenshot();
