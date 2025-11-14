import { AUTH_ROUTES } from "@/features/auth/routes";
import { CookieManager } from "@/features/shared/lib/cookieManager";
import { SHARED_ROUTES } from "@/features/shared/lib/routes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
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
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Middlewareを適用するパスを設定
export const config = {
  matcher: [
    // 静的ファイル、API routes、Next.js内部パス、MSW worker、画像を除外
    "/((?!_next/static|_next/image|favicon.ico|api|mockServiceWorker.js|images).*)",
  ],
};
