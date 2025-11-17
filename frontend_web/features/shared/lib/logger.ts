import { CookieManager } from "@/features/shared/lib/cookieManager";
import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";

interface BaseLogData {
  timestamp: string;
  requestId: string;
  userId?: string;
  sessionId?: string;
}

interface AccessLogData extends BaseLogData {
  method: string;
  path: string;
  query: string;
  status: number;
  userAgent: string;
  ip: string;
  redirectTo?: string;
}

interface ApiRequestLogData extends BaseLogData {
  type: "api_request" | "api_request_mock";
  method: string;
  path: string;
  status: number;
  duration: string;
}

// Extract userId from session cookie (JWT payload)
function extractUserId(sessionCookie?: string): string | undefined {
  if (!sessionCookie) return undefined;

  try {
    // JWT format: header.payload.signature
    const parts = sessionCookie.split(".");
    if (parts.length !== 3) return undefined;

    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    return payload.sub || payload.userId || undefined;
  } catch {
    return undefined;
  }
}

export function logAccess(
  request: NextRequest,
  status: number,
  redirectTo?: string,
): void {
  const sessionCookie = request.cookies.get(
    CookieManager.KEYS.ACCESS_TOKEN,
  )?.value;
  const requestId = request.headers.get("x-request-id") || randomUUID();

  const logData: AccessLogData = {
    timestamp: new Date().toISOString(),
    requestId,
    userId: extractUserId(sessionCookie),
    sessionId: sessionCookie
      ? sessionCookie.split(".")[2]?.slice(0, 8)
      : undefined,
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

export async function logApiRequest(
  method: string,
  path: string,
  status: number,
  duration: number,
  isMock = false,
): Promise<void> {
  const requestId = randomUUID();
  let sessionCookie: string | undefined;

  try {
    sessionCookie = await CookieManager.getAccessTokenCookie();
  } catch {
    // Client-side or no cookie
  }

  const logData: ApiRequestLogData = {
    type: isMock ? "api_request_mock" : "api_request",
    timestamp: new Date().toISOString(),
    requestId,
    userId: extractUserId(sessionCookie),
    sessionId: sessionCookie
      ? sessionCookie.split(".")[2]?.slice(0, 8)
      : undefined,
    method,
    path,
    status,
    duration: `${duration}ms`,
  };

  console.log(JSON.stringify(logData));
}
