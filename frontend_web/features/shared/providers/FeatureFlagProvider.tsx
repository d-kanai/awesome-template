"use client";

import { API_BASE_URL } from "@/features/shared/api/config";
import { FlagProvider } from "@unleash/proxy-client-react";

/**
 * FeatureFlagProvider
 * Unleash Proxy Clientを使用して機能フラグを管理
 */

/**
 * 機能フラグの定数
 */
export const FEATURE_FLAGS = {
  SHOW_VERSION_INFO: "show-version-info",
} as const;

const unleashConfig = {
  url: `${API_BASE_URL}/featureflags/proxy`,
  clientKey: "proxy",
  refreshInterval: 3, // 開発時は3秒、本番では60-300秒推奨
  appName: "awesome-template-web",
  environment: process.env.NODE_ENV || "development",
};

export function FeatureFlagProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FlagProvider config={unleashConfig}>{children}</FlagProvider>;
}
