/// <reference types="node" />

/**
 * 環境変数の型定義
 * process.envでドット記法を使用可能にするための型拡張
 */
declare namespace NodeJS {
  interface ProcessEnv {
    // Server-side環境変数
    NODE_ENV: "development" | "production" | "test";
    ANALYZE: "true" | "false";

    // Client-side環境変数（NEXT_PUBLIC_ prefix）
    NEXT_PUBLIC_API_BASE_URL: string;
    NEXT_PUBLIC_API_MOCK_MODE: "true" | "false";

    // E2E/CI環境変数（オプショナル）
    CI?: string;
    BASE_URL?: string;
  }
}
