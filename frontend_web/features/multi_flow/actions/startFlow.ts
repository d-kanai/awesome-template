"use server";

import { createLoggerAsync } from "@/features/shared/lib/logger";

export async function startFlow() {
  const logger = await createLoggerAsync();
  logger.info({
    type: "info",
    message: "Flow started - preparing confirm step",
    action: "startFlow",
    note: "In real implementation, this would call Java API /flow/start to set Redis flag",
  });

  return { success: true };
}
