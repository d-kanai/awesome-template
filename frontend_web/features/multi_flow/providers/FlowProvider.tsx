"use client";

import { type ReactNode, createContext, useState } from "react";
import type { FlowContextValue, FlowData, FlowStep } from "../types";

export const FlowContext = createContext<FlowContextValue | undefined>(
  undefined,
);

type FlowProviderProps = {
  children: ReactNode;
};

export function FlowProvider({ children }: FlowProviderProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>(null);
  const [formData, setFormDataState] = useState<FlowData | null>(null);

  const setFormData = (data: FlowData) => {
    setFormDataState(data);
  };

  const goToConfirm = () => {
    setCurrentStep("confirm");
  };

  const goToComplete = () => {
    setCurrentStep("complete");
  };

  const reset = () => {
    setCurrentStep(null);
    setFormDataState(null);
  };

  const value: FlowContextValue = {
    currentStep,
    formData,
    setFormData,
    goToConfirm,
    goToComplete,
    reset,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}
