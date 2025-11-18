import type { ReactNode } from "react";

type MultiFlowLayoutProps = {
  children: ReactNode;
};

export default function MultiFlowLayout({ children }: MultiFlowLayoutProps) {
  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">{children}</div>
  );
}
