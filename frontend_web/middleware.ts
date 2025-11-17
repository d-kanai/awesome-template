import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_ROUTES } from "@/features/auth/routes";
import { CookieManager } from "@/features/shared/lib/cookieManager";
import { generateShortId } from "@/features/shared/lib/dateTime";
import { logAccess } from "@/features/shared/lib/logger";
import { SHARED_ROUTES } from "@/features/shared/lib/routes";

const PUBLIC_PATHS = [
  SHARED_ROUTES.HOME,
  "/home", // HomePage demo
  AUTH_ROUTES.SIGNIN,
  AUTH_ROUTES.SIGNUP,
  "/api/health", // Health check endpoint
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => path === pathname);
}

function handleUnauthenticatedRequest(
  request: NextRequest,
  requestId: string,
): NextResponse {
  const signInUrl = new URL(AUTH_ROUTES.SIGNIN, request.url);
  signInUrl.searchParams.set("return_to", request.nextUrl.pathname);

  logAccess(request, 307, signInUrl.pathname, requestId);

  return NextResponse.redirect(signInUrl);
}

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(CookieManager.KEYS.ACCESS_TOKEN);

  // Generate or use existing request ID
  const requestId = request.headers.get("x-request-id") || generateShortId();

  // 公開パス以外で未認証の場合、サインインページにリダイレクト
  if (!isPublicPath(request.nextUrl.pathname) && !sessionCookie) {
    return handleUnauthenticatedRequest(request, requestId);
  }

  logAccess(request, 200, undefined, requestId);

  const response = NextResponse.next();

  // Pass request ID to downstream handlers (Server Components, Server Actions)
  response.headers.set("x-request-id", requestId);

  return response;
}

// Middlewareを適用するパスを設定
export const config = {
  matcher: [
    // 静的ファイル、Next.js内部パス、画像を除外（API routesは含める）
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
