import { z } from "zod";

/**
 * 環境変数のスキーマ（Expo の EXPO_PUBLIC_ プレフィックス）
 */
const envSchema = z.object({
  // アプリ環境（必須）
  EXPO_PUBLIC_ENV: z.enum(["development", "test", "staging", "production"]),
  // WebView URL（必須）
  EXPO_PUBLIC_WEBVIEW_URL: z.string().url(),
});

const processEnv = {
  EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
  EXPO_PUBLIC_WEBVIEW_URL: process.env.EXPO_PUBLIC_WEBVIEW_URL,
};

const _env = envSchema.safeParse(processEnv);

if (!_env.success) {
  console.error("❌ Environment validation errors:");
  console.error(_env.error.format());
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(_env.error.format(), null, 2)}`,
  );
}

export const env = _env.data;

/**
 * 環境判定ヘルパー
 */
export const isDev = env.EXPO_PUBLIC_ENV === "development";
export const isTest = env.EXPO_PUBLIC_ENV === "test";
export const isStaging = env.EXPO_PUBLIC_ENV === "staging";
export const isProd = env.EXPO_PUBLIC_ENV === "production";
