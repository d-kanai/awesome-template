import { cookies } from "next/headers";
import { isProd } from "./env";

type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
  path?: string;
};

// biome-ignore lint/complexity/noStaticOnlyClass: Cookie管理の責務をカプセル化するためのクラス
export class CookieManager {
  static readonly KEYS = {
    ACCESS_TOKEN: "accessToken",
  } as const;

  private static async get(key: string): Promise<string | undefined> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(key);
    return cookie?.value;
  }

  private static async getCookie(key: string): Promise<string | undefined> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(key);
    if (!cookie) return undefined;
    return `${cookie.name}=${cookie.value}`;
  }

  private static async set(
    key: string,
    value: string,
    options?: CookieOptions,
  ): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(key, value, {
      httpOnly: options?.httpOnly ?? true,
      secure: options?.secure ?? isProd,
      sameSite: options?.sameSite ?? "lax",
      maxAge: options?.maxAge ?? 60 * 60 * 24 * 30, // デフォルト30日
      path: options?.path ?? "/",
    });
  }

  private static async delete(key: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(key);
  }

  static async getAccessToken(): Promise<string | undefined> {
    return CookieManager.get(CookieManager.KEYS.ACCESS_TOKEN);
  }

  static async getAccessTokenCookie(): Promise<string | undefined> {
    return CookieManager.getCookie(CookieManager.KEYS.ACCESS_TOKEN);
  }

  static async setAccessToken(
    token: string,
    options?: CookieOptions,
  ): Promise<void> {
    return CookieManager.set(CookieManager.KEYS.ACCESS_TOKEN, token, options);
  }

  static async deleteAccessToken(): Promise<void> {
    return CookieManager.delete(CookieManager.KEYS.ACCESS_TOKEN);
  }
}
