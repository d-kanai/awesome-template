import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_ROUTES } from "@/features/auth/routes";
import { CookieManager } from "@/shared/lib/cookieManager";
import { generateShortId } from "@/shared/lib/dateTime";
import { isDev } from "@/shared/lib/env";
import { HeaderManager } from "@/shared/lib/headerManager";
import { proxyLog } from "@/shared/lib/logger";
import { SHARED_ROUTES } from "@/shared/lib/routes";

/**
 * Generate a cryptographically secure nonce for CSP
 */
function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString("base64");
}

/**
 * Build CSP header with nonce
 * @param nonce - The nonce to include in script-src and style-src
 */
function buildCspHeader(nonce: string): string {
  return [
    "default-src 'self'",
    // nonce-based CSP Level 3. devモードではHMR等のためunsafe-evalも許可
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

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

  // Generate nonce for CSP Level 3
  const nonce = generateNonce();

  // Pass nonce to layout.tsx via header (for next-themes and other inline scripts)
  response.headers.set("x-nonce", nonce);

  // セキュリティヘッダー
  response.headers.set("Content-Security-Policy", buildCspHeader(nonce));
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
