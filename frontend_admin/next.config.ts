import type { NextConfig } from "next";
import { env } from "./shared/lib/env";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  // TypeScriptの型エラーでビルドを失敗させる
  typescript: {
    ignoreBuildErrors: false,
  },

  // Pino logger を外部パッケージとして扱う（Turbopackでバンドルしない）
  serverExternalPackages: ["pino", "pino-pretty"],

  // CSP (Content Security Policy)
  // 動的レンダリング時にNext.jsがnonceを自動生成してスクリプトに適用
  // ProxyでCSPヘッダーを設定（next.config.ts headersではnonceが使えないため）
};

export default withBundleAnalyzer(nextConfig);
