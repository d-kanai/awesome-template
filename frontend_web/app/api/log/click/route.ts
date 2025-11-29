import type { NextRequest } from "next/server";
import { createLogger, LogType } from "@/features/shared/lib/logger";

/**
 * Click event logging endpoint
 * Receives click events from Beacon API
 */
export async function POST(request: NextRequest) {
  const logger = createLogger(request);
  const body = await request.json();
  const userAgent = request.headers.get("user-agent") || "-";

  logger.info({
    type: LogType.CLICK_EVENT,
    userAgent,
    ...body,
  });

  return new Response(null, { status: 204 });
}
