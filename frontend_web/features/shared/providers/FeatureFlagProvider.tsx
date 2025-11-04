"use client";

import { API_BASE_URL } from "@/features/shared/lib/constants";
import { FlagProvider } from "@unleash/proxy-client-react";

/**
 * FeatureFlagProvider
 * Unleash Proxy Clientを使用して機能フラグを管理
 */

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
