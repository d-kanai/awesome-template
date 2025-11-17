import { AUTH_ROUTES } from "@/features/auth/routes";
import { CookieManager } from "@/features/shared/lib/cookieManager";
import { logAccess } from "@/features/shared/lib/logger";
import { SHARED_ROUTES } from "@/features/shared/lib/routes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  SHARED_ROUTES.HOME,
  "/home", // HomePage demo
  AUTH_ROUTES.SIGNIN,
  AUTH_ROUTES.SIGNUP,
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => path === pathname);
}

function handleUnauthenticatedRequest(
  request: NextRequest,
  startTime: number,
): NextResponse {
  const signInUrl = new URL(AUTH_ROUTES.SIGNIN, request.url);
  signInUrl.searchParams.set("return_to", request.nextUrl.pathname);

  logAccess(request, 307, startTime, signInUrl.pathname);

  return NextResponse.redirect(signInUrl);
}

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const sessionCookie = request.cookies.get(CookieManager.KEYS.ACCESS_TOKEN);

  // 公開パス以外で未認証の場合、サインインページにリダイレクト
  if (!isPublicPath(request.nextUrl.pathname) && !sessionCookie) {
    return handleUnauthenticatedRequest(request, startTime);
  }

  logAccess(request, 200, startTime);

  return NextResponse.next();
}

// Middlewareを適用するパスを設定
export const config = {
  matcher: [
    // 静的ファイル、Next.js内部パス、画像を除外（API routesは含める）
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
