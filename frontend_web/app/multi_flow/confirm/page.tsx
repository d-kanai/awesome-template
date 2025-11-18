"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFlowStore } from "@/features/multi_flow/stores/useFlowStore";
import { MULTI_FLOW_ROUTES } from "@/features/multi_flow/routes";
import { ConfirmScreen } from "@/features/multi_flow/screens/ConfirmScreen";

export default function ConfirmPage() {
  const router = useRouter();
  const currentStep = useFlowStore((state) => state.currentStep);

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
