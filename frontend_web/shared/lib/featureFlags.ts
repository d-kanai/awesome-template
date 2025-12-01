import { CookieManager } from "@/shared/lib/cookieManager";
import { isDev, isStaging } from "@/shared/lib/env";

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
  if (isDev || isStaging) return true;
  if (ctx.userId === "1") return true;
  return false;
}

export async function getFeatureFlags() {
  const ctx = await getUserContext();

  return {
    showVersionInfo: isShowVersionInfoEnabled(ctx),
  } as const;
}

export type FeatureFlags = Awaited<ReturnType<typeof getFeatureFlags>>;
