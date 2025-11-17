"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFlowContext } from "@/features/multi_flow/hooks/useFlowContext";
import { MULTI_FLOW_ROUTES } from "@/features/multi_flow/routes";
import { ConfirmScreen } from "@/features/multi_flow/screens/ConfirmScreen";

export default function ConfirmPage() {
  const router = useRouter();
  const { currentStep } = useFlowContext();

  useEffect(() => {
    if (currentStep !== "confirm") {
      router.replace(MULTI_FLOW_ROUTES.INPUT);
    }
  }, [currentStep, router]);

  if (currentStep !== "confirm") {
    return null;
  }

  return <ConfirmScreen />;
}
