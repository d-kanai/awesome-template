import { NextResponse } from "next/server";
import { getJSTTimestamp } from "@/features/shared/lib/dateTime";
import { createLoggerAsync } from "@/features/shared/lib/logger";

export async function GET() {
  const timestamp = getJSTTimestamp();

  const logger = await createLoggerAsync();
  logger.info({
    type: "info",
    message: "Health check endpoint accessed",
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
