import { NextResponse } from "next/server";
import { getJSTTimestamp } from "@/shared/lib/dateTime";
import { createLoggerAsync, LogType } from "@/shared/lib/logger";

export async function GET() {
  const timestamp = getJSTTimestamp();

  const logger = await createLoggerAsync();
  logger.info({
    type: LogType.INFO,
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
