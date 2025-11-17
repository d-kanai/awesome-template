import pino from "pino";
import { env, isDev } from "./env";

/**
 * Pino logger instance configured for development and production
 *
 * Development:
 * - JSON output with base pino (pino-pretty can be used via CLI: | pnpm pino-pretty)
 * - Default level: debug
 *
 * Production:
 * - JSON structured logs for CloudWatch
 * - Default level: info
 * - Optimized for performance
 *
 * Note: We don't use pino-pretty transport here to avoid Next.js build issues with Turbopack.
 * For development, pipe the output through pino-pretty CLI if needed:
 * `pnpm dev | pnpm pino-pretty`
 */
export const logger = pino({
  level: env.LOG_LEVEL || (isDev ? "debug" : "info"),
  formatters: {
    level: (label: string) => {
      return { level: label };
    },
  },
  // Add browser check to avoid issues in client-side code
  browser: {
    asObject: true,
  },
});
