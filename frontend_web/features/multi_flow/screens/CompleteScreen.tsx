"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/features/shared/ui/atoms/Button";
import { CompleteScreenButtonIds } from "../ids";
import { MULTI_FLOW_ROUTES } from "../routes";
import { useFlowStore } from "../stores/useFlowStore";

export function CompleteScreen() {
  const router = useRouter();
  const reset = useFlowStore((state) => state.reset);

  useEffect(() => {
    reset();
  }, [reset]);

  const handleBackToInput = () => {
    router.push(MULTI_FLOW_ROUTES.INPUT);
  };

  return (
    <>
      <SuccessMessage />
      <ActionButton onClick={handleBackToInput} />
    </>
  );
}

function SuccessMessage() {
  return (
    <div className="text-center space-y-4">
      <SuccessIcon />
      <Header />
      <Description />
    </div>
  );
}

function SuccessIcon() {
  return (
    <div className="flex justify-center">
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-primary-foreground"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          role="img"
          aria-label="成功"
        >
          <title>成功</title>
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
}

function Header() {
  return <h1 className="text-3xl font-bold">送信完了</h1>;
}

function Description() {
  return (
    <p className="text-muted-foreground">
      お問い合わせありがとうございました。
      <br />
      内容を確認の上、ご連絡させていただきます。
    </p>
  );
}

type ActionButtonProps = {
  onClick: () => void;
};

function ActionButton({ onClick }: ActionButtonProps) {
  return (
    <div className="mt-8 flex justify-center">
      <Button
        id={CompleteScreenButtonIds.backToInput}
        variant="primary"
        onClick={onClick}
      >
        最初に戻る
      </Button>
    </div>
  );
}
