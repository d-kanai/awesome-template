"use server";

import { info } from "@/features/shared/lib/logger";
import type { FlowData } from "../types";

type CompleteFlowResponse = {
  success: boolean;
  error?: string;
};

export async function completeFlow(
  data: FlowData,
): Promise<CompleteFlowResponse> {
  await info("Flow completion requested", {
    action: "completeFlow",
    data,
    note: "In real implementation, this would call Java API /flow/complete with Redis validation",
  });

  return { success: true };
}
