"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type FlowStep = "input" | "confirm" | "complete" | null;

export type FlowData = {
  name: string;
  email: string;
  message: string;
};

type FlowStore = {
  currentStep: FlowStep;
  formData: FlowData | null;
  setFormData: (data: FlowData) => void;
  goToConfirm: () => void;
  goToComplete: () => void;
  reset: () => void;
};

export const useFlowStore = create<FlowStore>()(
  devtools(
    (set) => ({
      currentStep: null,
      formData: null,
      setFormData: (data) => set({ formData: data }),
      goToConfirm: () => set({ currentStep: "confirm" }),
      goToComplete: () => set({ currentStep: "complete" }),
      reset: () => set({ currentStep: null, formData: null }),
    }),
    { name: "FlowStore" },
  ),
);
