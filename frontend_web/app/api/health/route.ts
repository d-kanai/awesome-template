import { NextResponse } from "next/server";

/**
 * ヘルスチェックエンドポイント
 * Dockerコンテナのヘルスチェックに使用
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
