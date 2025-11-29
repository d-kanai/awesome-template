import { headers } from "next/headers";

export const HEADER_KEYS = {
  REQUEST_ID: "x-request-id",
  USER_AGENT: "user-agent",
  FORWARDED_FOR: "x-forwarded-for",
  CONTENT_TYPE: "Content-Type",
  COOKIE: "Cookie",
} as const;

// biome-ignore lint/complexity/noStaticOnlyClass: CookieManagerと同じパターンで一貫性を保つため
export class HeaderManager {
  static readonly KEYS = HEADER_KEYS;

  static async getRequestId(): Promise<string | undefined> {
    try {
      const headersList = await headers();
      return headersList.get(HEADER_KEYS.REQUEST_ID) || undefined;
    } catch {
      // Client-side or headers not available
      return undefined;
    }
  }
}
