"use server";

import { info } from "@/features/shared/lib/logger";

export async function startFlow() {
  await info("Flow started - preparing confirm step", {
    action: "startFlow",
    note: "In real implementation, this would call Java API /flow/start to set Redis flag",
  });

  return { success: true };
}
