import { AUTH_ROUTES } from "@/features/auth/routes";
import { CookieManager } from "@/features/shared/lib/cookieManager";
import { SHARED_ROUTES } from "@/features/shared/lib/routes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const sessionCookie = request.cookies.get(CookieManager.KEYS.ACCESS_TOKEN);

  // 認証不要なパスのホワイトリスト
  const publicPaths = [
    SHARED_ROUTES.HOME,
    "/home", // HomePage demo
    AUTH_ROUTES.SIGNIN,
    AUTH_ROUTES.SIGNUP,
  ];

  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path,
  );

  // 公開パス以外で未認証の場合、サインインページにリダイレクト
  if (!isPublicPath && !sessionCookie) {
    const signInUrl = new URL(AUTH_ROUTES.SIGNIN, request.url);
    // リダイレクト後に元のページに戻れるようにreturn_toパラメータを追加
    signInUrl.searchParams.set("return_to", request.nextUrl.pathname);

    // Access log
    const duration = Date.now() - startTime;
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        method: request.method,
        path: request.nextUrl.pathname,
        query: request.nextUrl.search,
        status: 307,
        duration: `${duration}ms`,
        userAgent: request.headers.get("user-agent") || "-",
        ip: request.headers.get("x-forwarded-for") || request.ip || "-",
        redirectTo: signInUrl.pathname,
      }),
    );

    return NextResponse.redirect(signInUrl);
  }

  const response = NextResponse.next();

  // Access log
  const duration = Date.now() - startTime;
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      method: request.method,
      path: request.nextUrl.pathname,
      query: request.nextUrl.search,
      status: 200,
      duration: `${duration}ms`,
      userAgent: request.headers.get("user-agent") || "-",
      ip: request.headers.get("x-forwarded-for") || request.ip || "-",
    }),
  );

  return response;
}

// Middlewareを適用するパスを設定
export const config = {
  matcher: [
    // 静的ファイル、Next.js内部パス、画像を除外（API routesは含める）
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
