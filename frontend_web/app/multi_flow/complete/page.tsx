"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MULTI_FLOW_ROUTES } from "@/features/multi_flow/routes";
import { CompleteScreen } from "@/features/multi_flow/screens/CompleteScreen";
import { useFlowStore } from "@/features/multi_flow/stores/useFlowStore";

export default function CompletePage() {
  const router = useRouter();
  const currentStep = useFlowStore((state) => state.currentStep);

  useEffect(() => {
    if (currentStep !== "complete") {
      router.replace(MULTI_FLOW_ROUTES.INPUT);
    }
  }, [currentStep, router]);

  if (currentStep !== "complete") {
    return null;
  }

  return <CompleteScreen />;
}
