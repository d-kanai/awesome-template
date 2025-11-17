import type { NextRequest } from "next/server";
import { CookieManager } from "@/features/shared/lib/cookieManager";
import {
  generateShortId,
  getJSTTimestamp,
} from "@/features/shared/lib/dateTime";

interface BaseLogData {
  timestamp: string;
  requestId: string;
  userId?: string;
  sessionId?: string;
}

interface AccessLogData extends BaseLogData {
  type: "middleware";
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
  body?: unknown;
}

interface InfoLogData extends BaseLogData {
  type: "info";
  message: string;
  data?: unknown;
}

// Sensitive field names to mask in logs
const SENSITIVE_FIELDS = [
  "password",
  "passwordConfirmation",
  "currentPassword",
  "newPassword",
  "tel",
  "phone",
  "phoneNumber",
  "email",
  "creditCard",
  "cardNumber",
  "cvv",
  "ssn",
  "token",
  "accessToken",
  "refreshToken",
  "apiKey",
  "secret",
] as const;

/**
 * Mask sensitive fields in an object for logging
 */
function maskSensitiveData(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(maskSensitiveData);
  }

  if (typeof data === "object") {
    const masked: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const isSensitive = SENSITIVE_FIELDS.some((field) =>
        key.toLowerCase().includes(field.toLowerCase()),
      );

      masked[key] = isSensitive
        ? "***MASKED***"
        : typeof value === "object" && value !== null
          ? maskSensitiveData(value)
          : value;
    }
    return masked;
  }

  return data;
}

/**
 * Extract user context from session cookie
 */
function extractUserContext(sessionCookie?: string): {
  userId?: string;
  sessionId?: string;
} {
  if (!sessionCookie) {
    return {};
  }

  try {
    const parts = sessionCookie.split(".");
    if (parts.length !== 3) {
      return {};
    }

    const part1 = parts[1];
    if (!part1) {
      return {};
    }

    const payload = JSON.parse(Buffer.from(part1, "base64").toString());
    return {
      userId: payload.sub || payload.userId || undefined,
      sessionId: parts[2]?.slice(0, 8),
    };
  } catch {
    return {};
  }
}

/**
 * Create base log data with common fields
 */
function createBaseLogData(
  requestId: string,
  sessionCookie?: string,
): BaseLogData {
  const { userId, sessionId } = extractUserContext(sessionCookie);

  return {
    timestamp: getJSTTimestamp(),
    requestId,
    userId,
    sessionId,
  };
}

/**
 * Log middleware access
 */
export function logAccess(
  request: NextRequest,
  status: number,
  redirectTo?: string,
  requestId?: string,
): void {
  const sessionCookie = request.cookies.get(
    CookieManager.KEYS.ACCESS_TOKEN,
  )?.value;
  const finalRequestId =
    requestId || request.headers.get("x-request-id") || generateShortId();

  const logData: AccessLogData = {
    ...createBaseLogData(finalRequestId, sessionCookie),
    type: "middleware",
    method: request.method,
    path: request.nextUrl.pathname,
    query: request.nextUrl.search,
    status,
    userAgent: request.headers.get("user-agent") || "-",
    ip: request.headers.get("x-forwarded-for") || "-",
    ...(redirectTo && { redirectTo }),
  };

  console.log(JSON.stringify(logData));
}

/**
 * Log API request
 */
export async function logApiRequest(
  method: string,
  path: string,
  status: number,
  duration: number,
  requestId?: string,
  isMock = false,
  body?: unknown,
): Promise<void> {
  let sessionCookie: string | undefined;

  try {
    sessionCookie = await CookieManager.getAccessTokenCookie();
  } catch {
    // Client-side or no cookie
  }

  const logData: ApiRequestLogData = {
    ...createBaseLogData(requestId || generateShortId(), sessionCookie),
    type: isMock ? "api_request_mock" : "api_request",
    method,
    path,
    status,
    duration: `${duration}ms`,
  };

  // Add body for POST/PUT/PATCH requests with sensitive data masked
  if (body && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
    logData.body = maskSensitiveData(body);
  }

  console.log(JSON.stringify(logData));
}

/**
 * General purpose info logging
 * Use this for production logs that don't fit into specific categories
 *
 * @param message - Log message (required)
 * @param data - Additional data to log (optional, will be masked for sensitive fields)
 * @param requestId - Optional request ID for correlation
 *
 * @example
 * // Simple message
 * logger.info("User profile updated");
 *
 * @example
 * // With data
 * logger.info("Payment processed", { amount: 1000, currency: "JPY" });
 *
 * @example
 * // With request ID for correlation
 * logger.info("Cache invalidated", { keys: ["user:123"] }, requestId);
 */
export async function info(
  message: string,
  data?: unknown,
  requestId?: string,
): Promise<void> {
  let sessionCookie: string | undefined;

  try {
    sessionCookie = await CookieManager.getAccessTokenCookie();
  } catch {
    // Client-side or no cookie
  }

  const logData: InfoLogData = {
    ...createBaseLogData(requestId || generateShortId(), sessionCookie),
    type: "info",
    message,
  };

  // Add data if provided, with sensitive field masking
  if (data !== undefined) {
    logData.data = maskSensitiveData(data);
  }

  console.log(JSON.stringify(logData));
}
