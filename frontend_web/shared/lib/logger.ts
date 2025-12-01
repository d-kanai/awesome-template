import type { NextRequest } from "next/server";
import pino, { type Logger } from "pino";
import { CookieManager } from "@/shared/lib/cookieManager";
import { generateShortId } from "@/shared/lib/dateTime";
import { env, isDev } from "@/shared/lib/env";
import { HeaderManager } from "@/shared/lib/headerManager";

/**
 * Base Pino logger instance
 */
const baseLogger = pino({
  level: env.LOG_LEVEL || (isDev ? "debug" : "info"),
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  browser: { asObject: true },
});

/**
 * Log event types
 */
export const LogType = {
  PROXY: "proxy",
  API_REQUEST: "api_request",
  API_REQUEST_MOCK: "api_request_mock",
  API_TIMEOUT: "api_timeout",
  API_ERROR: "api_error",
  CLICK_EVENT: "click_event",
  INFO: "info",
} as const;

export type LogType = (typeof LogType)[keyof typeof LogType];

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

const MASKED_VALUE = "***MASKED***";

/**
 * Check if a field name is sensitive
 */
function isSensitiveField(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return SENSITIVE_FIELDS.some((field) =>
    lowerKey.includes(field.toLowerCase()),
  );
}

/**
 * Mask a single value based on key sensitivity
 */
function maskValue(key: string, value: unknown): unknown {
  if (isSensitiveField(key)) {
    return MASKED_VALUE;
  }
  if (typeof value === "object" && value !== null) {
    return maskSensitive(value);
  }
  return value;
}

/**
 * Mask object fields
 */
function maskObject(data: Record<string, unknown>): Record<string, unknown> {
  const masked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    masked[key] = maskValue(key, value);
  }
  return masked;
}

/**
 * Mask sensitive fields in an object for logging
 */
function maskSensitive(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(maskSensitive);
  }
  if (typeof data === "object") {
    return maskObject(data as Record<string, unknown>);
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
 * Create a Pino child logger with request context from NextRequest
 *
 * @param request - Next.js request object
 * @param requestId - Optional request ID (auto-generated if not provided)
 * @returns Pino child logger with requestId, userId, sessionId bindings
 *
 * @example
 * // In proxy.ts
 * const logger = createLogger(request);
 * logger.info({ type: "proxy", method: "GET", path: "/user", status: 200 });
 */
export function createLogger(request: NextRequest, requestId?: string): Logger {
  const sessionCookie = request.cookies.get(
    CookieManager.KEYS.ACCESS_TOKEN,
  )?.value;
  const finalRequestId =
    requestId ||
    request.headers.get(HeaderManager.KEYS.REQUEST_ID) ||
    generateShortId();
  const { userId, sessionId } = extractUserContext(sessionCookie);

  return baseLogger.child({
    requestId: finalRequestId,
    ...(userId && { userId }),
    ...(sessionId && { sessionId }),
  });
}

/**
 * Create a Pino child logger with request context (async version for Server Components/Actions)
 *
 * @param requestId - Optional request ID (auto-generated if not provided)
 * @returns Pino child logger with requestId, userId, sessionId bindings
 *
 * @example
 * // In API route or Server Action
 * const logger = await createLoggerAsync();
 * logger.info({ type: "api_request", method: "POST", path: "/auth/signin", status: 200 });
 */
export async function createLoggerAsync(requestId?: string): Promise<Logger> {
  let sessionCookie: string | undefined;

  try {
    sessionCookie = await CookieManager.getAccessTokenCookie();
  } catch {
    // Client-side or no cookie
  }

  const { userId, sessionId } = extractUserContext(sessionCookie);

  return baseLogger.child({
    requestId: requestId || generateShortId(),
    ...(userId && { userId }),
    ...(sessionId && { sessionId }),
  });
}

/**
 * Log proxy (middleware) access
 *
 * @param request - Next.js request object
 * @param options - Logging options
 *
 * @example
 * proxyLog(request, { status: 200, requestId });
 * proxyLog(request, { status: 307, redirectTo: "/auth/signin" });
 */
export function proxyLog(
  request: NextRequest,
  options: {
    status: number;
    requestId?: string;
    redirectTo?: string;
  },
): void {
  const logger = createLogger(request, options.requestId);
  logger.info({
    type: LogType.PROXY,
    method: request.method,
    path: request.nextUrl.pathname,
    query: request.nextUrl.search,
    status: options.status,
    userAgent: request.headers.get(HeaderManager.KEYS.USER_AGENT) || "-",
    ip: request.headers.get(HeaderManager.KEYS.FORWARDED_FOR) || "-",
    ...(options.redirectTo && { redirectTo: options.redirectTo }),
  });
}

/**
 * Log API request
 *
 * @param options - API logging options
 *
 * @example
 * await apiLog({ method: "POST", path: "/auth/signin", status: 200, duration: 45 });
 * await apiLog({ method: "POST", path: "/auth/signin", status: 200, duration: 45, body: requestData, isMock: true });
 */
export async function apiLog(options: {
  method: string;
  path: string;
  status: number;
  duration: number;
  requestId?: string;
  isMock?: boolean;
  body?: unknown;
}): Promise<void> {
  const logger = await createLoggerAsync(options.requestId);
  const logData: Record<string, unknown> = {
    type: options.isMock ? LogType.API_REQUEST_MOCK : LogType.API_REQUEST,
    method: options.method,
    path: options.path,
    status: options.status,
    duration: `${options.duration}ms`,
  };

  // Add body for POST/PUT/PATCH requests with sensitive data masked
  if (
    options.body &&
    ["POST", "PUT", "PATCH"].includes(options.method.toUpperCase())
  ) {
    logData.body = maskSensitive(options.body);
  }

  logger.info(logData);
}

/**
 * Log slow API request warning
 *
 * @param options - Slow request logging options
 *
 * @example
 * slowRequestLog({ method: "GET", path: "/users", status: 200, duration: 3500, threshold: 3000 });
 */
export async function slowRequestLog(options: {
  method: string;
  path: string;
  status: number;
  duration: number;
  requestId?: string;
  threshold: number;
}): Promise<void> {
  const logger = await createLoggerAsync(options.requestId);
  logger.warn({
    type: LogType.API_REQUEST,
    isSlow: true,
    method: options.method,
    path: options.path,
    status: options.status,
    duration: `${options.duration}ms`,
    threshold: `${options.threshold}ms`,
    msg: `Slow request: ${options.method} ${options.path} took ${options.duration}ms (threshold: ${options.threshold}ms)`,
  });
}

/**
 * Log API timeout error
 */
export async function apiTimeoutLog(options: {
  method: string;
  path: string;
  timeoutMs: number;
  duration: number;
  requestId?: string;
  error: Error;
}): Promise<void> {
  const logger = await createLoggerAsync(options.requestId);
  logger.error({
    type: LogType.API_TIMEOUT,
    err: options.error,
    method: options.method,
    path: options.path,
    timeoutMs: options.timeoutMs,
    duration: `${options.duration}ms`,
  });
}

/**
 * Log API error
 */
export async function apiErrorLog(options: {
  method: string;
  path: string;
  status: number;
  duration: number;
  requestId?: string;
  error: Error;
}): Promise<void> {
  const logger = await createLoggerAsync(options.requestId);
  logger.error({
    type: LogType.API_ERROR,
    err: options.error,
    method: options.method,
    path: options.path,
    status: options.status,
    duration: `${options.duration}ms`,
  });
}
