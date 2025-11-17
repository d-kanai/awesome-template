"use client";

import { useContext } from "react";
import { FlowContext } from "../providers/FlowProvider";

export function useFlowContext() {
  const context = useContext(FlowContext);

  if (context === undefined) {
    throw new Error("useFlowContext must be used within a FlowProvider");
  }

  return context;
}
