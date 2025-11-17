import type { ReactNode } from "react";
import { FlowProvider } from "@/features/multi_flow/providers/FlowProvider";

type MultiFlowLayoutProps = {
  children: ReactNode;
};

export default function MultiFlowLayout({ children }: MultiFlowLayoutProps) {
  return (
    <FlowProvider>
      <div className="container max-w-2xl mx-auto py-12 px-4">{children}</div>
    </FlowProvider>
  );
}
