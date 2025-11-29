"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui/atoms/Button/Button";
import { InputField } from "@/shared/ui/atoms/InputField/InputField";
import { startFlow } from "../actions/startFlow";
import { InputScreenButtonIds } from "../ids";
import { MULTI_FLOW_ROUTES } from "../routes";
import { useFlowStore } from "../stores/useFlowStore";

export function InputScreen() {
  const router = useRouter();
  const setFormData = useFlowStore((state) => state.setFormData);
  const goToConfirm = useFlowStore((state) => state.goToConfirm);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    setIsSubmitting(true);

    try {
      const data = { name, email, message };
      setFormData(data);

      await startFlow();

      goToConfirm();
      router.push(MULTI_FLOW_ROUTES.CONFIRM);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <Form
        name={name}
        email={email}
        message={message}
        onNameChange={setName}
        onEmailChange={setEmail}
        onMessageChange={setMessage}
      />
      <NextButton
        onClick={handleNext}
        disabled={!name || !email || !message || isSubmitting}
        isSubmitting={isSubmitting}
      />
    </>
  );
}

function Header() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">入力画面</h1>
      <p className="text-muted-foreground mt-2">必要な情報を入力してください</p>
    </div>
  );
}

type FormProps = {
  name: string;
  email: string;
  message: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onMessageChange: (value: string) => void;
};

function Form({
  name,
  email,
  message,
  onNameChange,
  onEmailChange,
  onMessageChange,
}: FormProps) {
  return (
    <div className="space-y-6">
      <NameField value={name} onChange={onNameChange} />
      <EmailField value={email} onChange={onEmailChange} />
      <MessageField value={message} onChange={onMessageChange} />
    </div>
  );
}

type FieldProps = {
  value: string;
  onChange: (value: string) => void;
};

function NameField({ value, onChange }: FieldProps) {
  return (
    <InputField
      id="name"
      label="お名前"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="山田 太郎"
    />
  );
}

function EmailField({ value, onChange }: FieldProps) {
  return (
    <InputField
      id="email"
      label="メールアドレス"
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="example@example.com"
    />
  );
}

function MessageField({ value, onChange }: FieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="message"
        className="block text-sm font-medium text-foreground"
      >
        メッセージ
      </label>
      <textarea
        id="message"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ご要望をご記入ください"
        rows={5}
        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

type NextButtonProps = {
  onClick: () => void;
  disabled: boolean;
  isSubmitting: boolean;
};

function NextButton({ onClick, disabled, isSubmitting }: NextButtonProps) {
  return (
    <div className="mt-8">
      <Button
        id={InputScreenButtonIds.next}
        variant="primary"
        onClick={onClick}
        disabled={disabled}
        className="w-full"
      >
        {isSubmitting ? "処理中..." : "確認画面へ"}
      </Button>
    </div>
  );
}
