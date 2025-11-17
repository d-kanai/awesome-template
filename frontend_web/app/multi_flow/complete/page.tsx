"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFlowContext } from "@/features/multi_flow/hooks/useFlowContext";
import { MULTI_FLOW_ROUTES } from "@/features/multi_flow/routes";
import { CompleteScreen } from "@/features/multi_flow/screens/CompleteScreen";

export default function CompletePage() {
  const router = useRouter();
  const { currentStep } = useFlowContext();

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
