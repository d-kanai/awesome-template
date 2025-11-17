import { z } from "zod";

/**
 * サーバー側環境変数のスキーマ
 * サーバーサイドコード（Server Actions, API Routes, middleware等）でのみ使用可能
 */
const serverSchema = z.object({
  // Node.js環境（Next.jsが自動設定）
  NODE_ENV: z.enum(["development", "production", "test"]),

  // Bundle Analyzer有効化フラグ（必須: "true" | "false"）
  ANALYZE: z.enum(["true", "false"]),
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
});

/**
 * 環境変数のバリデーションと型推論
 */
const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  ANALYZE: process.env.ANALYZE,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_API_MOCK_MODE: process.env.NEXT_PUBLIC_API_MOCK_MODE,
};

// サーバー環境変数のバリデーション（サーバー側でのみ実行）
const _serverEnv =
  typeof window === "undefined" ? serverSchema.safeParse(processEnv) : null;

// クライアント環境変数のバリデーション
const _clientEnv = clientSchema.safeParse(processEnv);

// バリデーションエラー時の処理
if (_serverEnv && !_serverEnv.success) {
  throw new Error("Invalid server environment variables");
}

if (!_clientEnv.success) {
  throw new Error("Invalid client environment variables");
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
 * 開発環境かどうかを判定
 */
export const isDev = env.NODE_ENV === "development";

/**
 * 本番環境かどうかを判定
 */
export const isProd = env.NODE_ENV === "production";

/**
 * テスト環境かどうかを判定
 */
export const isTest = env.NODE_ENV === "test";
