/**
 * API Base URL
 * 環境変数から取得。未設定の場合はlocalhostを使用
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

/**
 * Feature Flags
 * Unleashで管理される機能フラグの定数
 */
export const FEATURE_FLAGS = {
  SHOW_VERSION_INFO: "show-version-info",
} as const;
