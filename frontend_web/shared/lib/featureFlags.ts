import { CookieManager } from "@/shared/lib/cookieManager";
import { isDev, isStaging } from "@/shared/lib/env";

/**
 * Feature Flag 一覧
 * 新しいフラグを追加する場合はここにキーを追加し、
 * 対応する isXxxEnabled 関数を実装すること
 */
export const FeatureFlag = {
  SHOW_VERSION_INFO: "showVersionInfo",
} as const;

export type FeatureFlagKey = (typeof FeatureFlag)[keyof typeof FeatureFlag];

interface UserContext {
  userId?: string;
}

async function getUserContext(): Promise<UserContext> {
  try {
    const sessionCookie = await CookieManager.getAccessTokenCookie();
    if (!sessionCookie) return {};

    const parts = sessionCookie.split(".");
    if (parts.length !== 3 || !parts[1]) return {};

    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    return {
      userId: payload.sub || payload.userId || undefined,
    };
  } catch {
    return {};
  }
}

function isShowVersionInfoEnabled(ctx: UserContext): boolean {
  if (isDev || isStaging) return false;
  if (ctx.userId === "1") return false;
  return false;
}

export async function getFeatureFlags(): Promise<
  Record<FeatureFlagKey, boolean>
> {
  const ctx = await getUserContext();

  return {
    [FeatureFlag.SHOW_VERSION_INFO]: isShowVersionInfoEnabled(ctx),
  };
}

export type FeatureFlags = Awaited<ReturnType<typeof getFeatureFlags>>;
