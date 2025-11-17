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

interface ApiRequestLogData {
  type: "api_request" | "api_request_mock";
  timestamp: string;
  method: string;
  path: string;
  status: number;
  duration: string;
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

export function logApiRequest(
  method: string,
  path: string,
  status: number,
  duration: number,
  isMock = false,
): void {
  const logData: ApiRequestLogData = {
    type: isMock ? "api_request_mock" : "api_request",
    timestamp: new Date().toISOString(),
    method,
    path,
    status,
    duration: `${duration}ms`,
  };

  console.log(JSON.stringify(logData));
}
