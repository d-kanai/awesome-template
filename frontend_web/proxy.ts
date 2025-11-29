import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_ROUTES } from "@/features/auth/routes";
import { CookieManager } from "@/features/shared/lib/cookieManager";
import { generateShortId } from "@/features/shared/lib/dateTime";
import { HeaderManager } from "@/features/shared/lib/headerManager";
import { proxyLog } from "@/features/shared/lib/logger";
import { SHARED_ROUTES } from "@/features/shared/lib/routes";

// CSP (Content Security Policy) 設定
// Note: Next.js 16では動的レンダリング時にnonceを自動生成するが、
// Proxyで設定したCSPヘッダーのnonceと一致しないため、'unsafe-inline'を使用
// TODO: Next.jsが公式にCSP nonce対応したら、'unsafe-inline'を削除してnonceに移行
const isDev = process.env.NODE_ENV === "development";
const CSP_HEADER = [
  "default-src 'self'",
  // Next.jsのインラインスクリプト用。devモードではHMR等のためunsafe-evalも許可
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'", // Tailwind/CSS-in-JS用
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
]
  .join("; ")
  .trim();

const PUBLIC_PATHS = [
  SHARED_ROUTES.HOME,
  "/home", // HomePage demo
  AUTH_ROUTES.SIGNIN,
  AUTH_ROUTES.SIGNUP,
  "/api/health", // Health check endpoint
  "/api/log/click", // Click event logging endpoint (public for Beacon API)
];

// Proxyログを出力しないパス（自身でログを出力するエンドポイント）
const SILENT_PATHS = ["/api/log/click"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => path === pathname);
}

function isSilentPath(pathname: string): boolean {
  return SILENT_PATHS.some((path) => path === pathname);
}

function handleUnauthenticatedRequest(
  request: NextRequest,
  requestId: string,
): NextResponse {
  const signInUrl = new URL(AUTH_ROUTES.SIGNIN, request.url);
  signInUrl.searchParams.set("return_to", request.nextUrl.pathname);

  proxyLog(request, {
    status: 307,
    requestId,
    redirectTo: signInUrl.pathname,
  });

  return NextResponse.redirect(signInUrl);
}

export default function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get(CookieManager.KEYS.ACCESS_TOKEN);

  // Generate or use existing request ID
  const requestId =
    request.headers.get(HeaderManager.KEYS.REQUEST_ID) || generateShortId();

  // 公開パス以外で未認証の場合、サインインページにリダイレクト
  if (!isPublicPath(request.nextUrl.pathname) && !sessionCookie) {
    return handleUnauthenticatedRequest(request, requestId);
  }

  // Silent paths skip proxy logging (they log themselves)
  if (!isSilentPath(request.nextUrl.pathname)) {
    proxyLog(request, { status: 200, requestId });
  }

  const response = NextResponse.next();

  // Pass request ID to downstream handlers (Server Components, Server Actions)
  response.headers.set(HeaderManager.KEYS.REQUEST_ID, requestId);

  // セキュリティヘッダー
  response.headers.set("Content-Security-Policy", CSP_HEADER);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return response;
}

// Proxyを適用するパスを設定
export const config = {
  matcher: [
    // 静的ファイル、Next.js内部パス、画像を除外（API routesは含める）
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
