import type { NextConfig } from "next";
import { env, isDev } from "./features/shared/lib/env";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: env.ANALYZE === "true",
});

// CSP（Content Security Policy）ホワイトリスト設定
// 外部ドメインを追加する場合は、各配列に追加してください
const CSP_WHITELIST = {
  // スクリプトソース（例: ["'self'", "https://trusted-cdn.com"]）
  scripts: ["'self'", ...(isDev ? ["'unsafe-eval'", "'unsafe-inline'"] : [])],

  // スタイルソース（Tailwind/CSS-in-JSのため 'unsafe-inline' が必要）
  styles: ["'self'", "'unsafe-inline'"],

  // 画像ソース（例: ["'self'", "data:", "blob:", "https://cdn.example.com"]）
  images: ["'self'", "data:", "blob:"],

  // フォントソース
  fonts: ["'self'", "data:"],

  // API接続先（例: ["'self'", "https://api.example.com"]）
  connect: ["'self'"],
};

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  // TypeScriptの型エラーでビルドを失敗させる
  typescript: {
    ignoreBuildErrors: false,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src ${CSP_WHITELIST.scripts.join(" ")}`,
              `style-src ${CSP_WHITELIST.styles.join(" ")}`,
              `img-src ${CSP_WHITELIST.images.join(" ")}`,
              `font-src ${CSP_WHITELIST.fonts.join(" ")}`,
              `connect-src ${CSP_WHITELIST.connect.join(" ")}`,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ]
              .join("; ")
              .trim(),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
