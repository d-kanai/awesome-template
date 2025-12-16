"use server";

import { CookieManager } from "@/shared/lib/cookieManager";

export type SaveTokenActionResponse = {
  success: boolean;
  error?: string;
};

/**
 * アクセストークンをHttpOnly Cookieに保存
 */
export async function saveTokenAction(
  accessToken: string,
): Promise<SaveTokenActionResponse> {
  try {
    await CookieManager.setAccessToken(accessToken);
    return { success: true };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Server Action logging
    console.error("saveTokenAction error:", error);
    return { success: false, error: "トークンの保存に失敗しました" };
  }
}
