import { CookieManager } from "@/features/shared/lib/cookieManager";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(CookieManager.KEYS.ACCESS_TOKEN);

  // 認証が必要なパスのリスト
  const protectedPaths = ["/user"];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (isProtectedPath && !sessionCookie) {
    // 未認証の場合、サインインページにリダイレクト
    const signInUrl = new URL("/auth/signin", request.url);
    // リダイレクト後に元のページに戻れるようにreturn_toパラメータを追加
    signInUrl.searchParams.set("return_to", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Middlewareを適用するパスを設定
export const config = {
  matcher: [
    // 認証が必要なパス
    "/user/:path*",
    // 除外するパス（静的ファイル、API routes、Next.js内部パス）
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
