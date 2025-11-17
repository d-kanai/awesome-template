/**
 * Date/Time utility functions
 *
 * IMPORTANT: Always use getNow() instead of new Date() to allow mocking in tests
 */

import { formatInTimeZone } from "date-fns-tz";

/**
 * Generate a short unique ID (12 characters)
 *
 * Uses timestamp + random string for uniqueness while keeping it short
 *
 * @returns Short unique ID (e.g., "6a8b9c4d3e2f")
 */
export function generateShortId(): string {
  const timestamp = Date.now().toString(36); // Base36 timestamp
  const randomPart = Math.random().toString(36).substring(2, 7); // 5 random chars
  return `${timestamp}${randomPart}`;
}

/**
 * Get current date/time
 *
 * Use this function instead of `new Date()` to allow mocking in tests
 *
 * @returns Current Date object
 *
 * @example
 * ```ts
 * // ❌ Don't use new Date() directly
 * const now = new Date();
 *
 * // ✅ Use getNow() instead
 * const now = getNow();
 * ```
 */
export function getNow(): Date {
  return new Date();
}

/**
 * Get current timestamp in JST (ISO 8601 format with +09:00 offset)
 *
 * @returns JST timestamp string (e.g., "2025-11-17T15:01:02.433+09:00")
 */
export function getJSTTimestamp(): string {
  return formatInTimeZone(
    getNow(),
    "Asia/Tokyo",
    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
  );
}
