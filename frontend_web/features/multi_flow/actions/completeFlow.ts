"use server";

import { createLoggerAsync } from "@/features/shared/lib/logger";
import type { FlowData } from "../stores/useFlowStore";

type CompleteFlowResponse = {
  success: boolean;
  error?: string;
};

export async function completeFlow(
  data: FlowData,
): Promise<CompleteFlowResponse> {
  const logger = await createLoggerAsync();
  logger.info({
    type: "info",
    message: "Flow completion requested",
    action: "completeFlow",
    data,
    note: "In real implementation, this would call Java API /flow/complete with Redis validation",
  });

  return { success: true };
}
