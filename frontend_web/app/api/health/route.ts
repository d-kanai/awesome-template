import { getJSTTimestamp } from "@/features/shared/lib/dateTime";
import { info } from "@/features/shared/lib/logger";
import { NextResponse } from "next/server";

export async function GET() {
  const timestamp = getJSTTimestamp();

  await info("Health check endpoint accessed", {
    timestamp,
    service: "frontend_web",
  });

  return NextResponse.json(
    {
      status: "healthy",
      timestamp,
    },
    { status: 200 },
  );
}
