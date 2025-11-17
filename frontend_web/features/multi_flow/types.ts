export type FlowStep = "input" | "confirm" | "complete" | null;

export type FlowData = {
  name: string;
  email: string;
  message: string;
};

export type FlowContextValue = {
  currentStep: FlowStep;
  formData: FlowData | null;
  setFormData: (data: FlowData) => void;
  goToConfirm: () => void;
  goToComplete: () => void;
  reset: () => void;
};
