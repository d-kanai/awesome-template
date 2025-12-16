import { z } from "zod";

/**
 * サーバー側環境変数のスキーマ
 * サーバーサイドコード（Server Actions, API Routes, middleware等）でのみ使用可能
 */
const serverSchema = z.object({
  // Node.js環境（Next.jsが自動設定）
  NODE_ENV: z.enum(["development", "production", "test"]),

  // アプリ環境（NODE_ENVと別に管理、stagingではNODE_ENV=productionになるため）
  ENV: z.enum(["development", "staging", "production", "test"]),

  // Bundle Analyzer有効化フラグ（必須: "true" | "false"）
  ANALYZE: z.enum(["true", "false"]),

  // ログレベル（オプション: "debug" | "info" | "warn" | "error"）
  // 未設定の場合: development=debug, production/test=info
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),

  // Auth0 Client Secret（Regular Web Application用、サーバーサイド専用）
  AUTH0_CLIENT_SECRET: z.string(),
});

/**
 * クライアント側環境変数のスキーマ
 * NEXT_PUBLIC_ プレフィックスが必要
 * ブラウザに公開されるため、秘密情報は含めないこと
 */
const clientSchema = z.object({
  // APIベースURL（必須）
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),

  // APIモックモード（必須: "true" | "false"）
  NEXT_PUBLIC_API_MOCK_MODE: z
    .enum(["true", "false"])
    .transform((val) => val === "true"),

  // APIタイムアウト（必須: ミリ秒）
  NEXT_PUBLIC_API_TIMEOUT_MS: z
    .string()
    .transform((val) => Number.parseInt(val, 10)),

  // Slow Request閾値（必須: ミリ秒）
  // この閾値を超えたリクエストはwarnレベルでログ出力される
  NEXT_PUBLIC_API_SLOW_THRESHOLD_MS: z
    .string()
    .transform((val) => Number.parseInt(val, 10)),

  // Mockoon Mock Server（E2E Testing Support）
  NEXT_PUBLIC_MOCKOON_ENABLED: z
    .enum(["true", "false"])
    .transform((val) => val === "true"),

  NEXT_PUBLIC_MOCKOON_ADMIN_URL: z.string().url(),

  // Auth0設定
  NEXT_PUBLIC_AUTH0_DOMAIN: z.string(), // e.g., "your-tenant.auth0.com"
  NEXT_PUBLIC_AUTH0_CLIENT_ID: z.string(), // Auth0 Application Client ID
});

/**
 * 環境変数のバリデーションと型推論
 */
const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  ENV: process.env.ENV,
  ANALYZE: process.env.ANALYZE,
  LOG_LEVEL: process.env.LOG_LEVEL,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_API_MOCK_MODE: process.env.NEXT_PUBLIC_API_MOCK_MODE,
  NEXT_PUBLIC_API_TIMEOUT_MS: process.env.NEXT_PUBLIC_API_TIMEOUT_MS,
  NEXT_PUBLIC_API_SLOW_THRESHOLD_MS:
    process.env.NEXT_PUBLIC_API_SLOW_THRESHOLD_MS,
  NEXT_PUBLIC_MOCKOON_ENABLED: process.env.NEXT_PUBLIC_MOCKOON_ENABLED,
  NEXT_PUBLIC_MOCKOON_ADMIN_URL: process.env.NEXT_PUBLIC_MOCKOON_ADMIN_URL,
  NEXT_PUBLIC_AUTH0_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
};

// サーバー環境変数のバリデーション（サーバー側でのみ実行）
const _serverEnv =
  typeof window === "undefined" ? serverSchema.safeParse(processEnv) : null;

// クライアント環境変数のバリデーション
const _clientEnv = clientSchema.safeParse(processEnv);

// バリデーションエラー時の処理
// Note: loggerはenvに依存するため、起動時エラーはconsole.errorを使用
if (_serverEnv && !_serverEnv.success) {
  console.error("❌ Server environment validation errors:");
  console.error(_serverEnv.error.format());
  throw new Error(
    `Invalid server environment variables: ${JSON.stringify(_serverEnv.error.format(), null, 2)}`,
  );
}

if (!_clientEnv.success) {
  console.error("❌ Client environment validation errors:");
  console.error(_clientEnv.error.format());
  throw new Error(
    `Invalid client environment variables: ${JSON.stringify(_clientEnv.error.format(), null, 2)}`,
  );
}

/**
 * 型安全な環境変数オブジェクト
 */
export const env = {
  // サーバー環境変数（サーバー側でのみアクセス可能）
  ...(typeof window === "undefined" && _serverEnv?.success
    ? _serverEnv.data
    : {}),

  // クライアント環境変数（どこからでもアクセス可能）
  ..._clientEnv.data,
} as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;

/**
 * 開発環境かどうかを判定（ENV基準）
 */
export const isDev = env.ENV === "development";

/**
 * ステージング環境かどうかを判定（ENV基準）
 */
export const isStaging = env.ENV === "staging";

/**
 * 本番環境かどうかを判定（ENV基準）
 */
export const isProd = env.ENV === "production";
