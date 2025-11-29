"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui/atoms/Button/Button";
import { completeFlow } from "../actions/completeFlow";
import { ConfirmScreenButtonIds } from "../ids";
import { MULTI_FLOW_ROUTES } from "../routes";
import { useFlowStore } from "../stores/useFlowStore";

export function ConfirmScreen() {
  const router = useRouter();
  const formData = useFlowStore((state) => state.formData);
  const goToComplete = useFlowStore((state) => state.goToComplete);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!formData) {
    return null;
  }

  const handleBack = () => {
    router.push(MULTI_FLOW_ROUTES.INPUT);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await completeFlow(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      goToComplete();
      router.push(MULTI_FLOW_ROUTES.COMPLETE);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <ConfirmationContent formData={formData} />
      {error && <ErrorMessage message={error} />}
      <ActionButtons
        onBack={handleBack}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}

function Header() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">確認画面</h1>
      <p className="text-muted-foreground mt-2">入力内容をご確認ください</p>
    </div>
  );
}

type ConfirmationContentProps = {
  formData: {
    name: string;
    email: string;
    message: string;
  };
};

function ConfirmationContent({ formData }: ConfirmationContentProps) {
  return (
    <div className="space-y-6 bg-muted p-6 rounded-lg">
      <ConfirmationItem label="お名前" value={formData.name} />
      <ConfirmationItem label="メールアドレス" value={formData.email} />
      <ConfirmationItem label="メッセージ" value={formData.message} />
    </div>
  );
}

type ConfirmationItemProps = {
  label: string;
  value: string;
};

function ConfirmationItem({ label, value }: ConfirmationItemProps) {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

type ErrorMessageProps = {
  message: string;
};

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg">
      {message}
    </div>
  );
}

type ActionButtonsProps = {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

function ActionButtons({ onBack, onSubmit, isSubmitting }: ActionButtonsProps) {
  return (
    <div className="mt-8 flex gap-4">
      <Button
        id={ConfirmScreenButtonIds.back}
        variant="neutral"
        onClick={onBack}
        disabled={isSubmitting}
        className="flex-1"
      >
        戻る
      </Button>
      <Button
        id={ConfirmScreenButtonIds.submit}
        variant="primary"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="flex-1"
      >
        {isSubmitting ? "送信中..." : "送信する"}
      </Button>
    </div>
  );
}
