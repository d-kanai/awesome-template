import type { NextRequest } from "next/server";

interface AccessLogData {
  timestamp: string;
  method: string;
  path: string;
  query: string;
  status: number;
  duration: string;
  userAgent: string;
  ip: string;
  redirectTo?: string;
}

export function logAccess(
  request: NextRequest,
  status: number,
  startTime: number,
  redirectTo?: string,
): void {
  const duration = Date.now() - startTime;
  const logData: AccessLogData = {
    timestamp: new Date().toISOString(),
    method: request.method,
    path: request.nextUrl.pathname,
    query: request.nextUrl.search,
    status,
    duration: `${duration}ms`,
    userAgent: request.headers.get("user-agent") || "-",
    ip: request.headers.get("x-forwarded-for") || "-",
  };

  if (redirectTo) {
    logData.redirectTo = redirectTo;
  }

  console.log(JSON.stringify(logData));
}
