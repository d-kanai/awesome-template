import type { NextRequest } from "next/server";

interface AccessLogData {
  timestamp: string;
  method: string;
  path: string;
  query: string;
  status: number;
  userAgent: string;
  ip: string;
  redirectTo?: string;
}

export function logAccess(
  request: NextRequest,
  status: number,
  redirectTo?: string,
): void {
  const logData: AccessLogData = {
    timestamp: new Date().toISOString(),
    method: request.method,
    path: request.nextUrl.pathname,
    query: request.nextUrl.search,
    status,
    userAgent: request.headers.get("user-agent") || "-",
    ip: request.headers.get("x-forwarded-for") || "-",
  };

  if (redirectTo) {
    logData.redirectTo = redirectTo;
  }

  console.log(JSON.stringify(logData));
}
