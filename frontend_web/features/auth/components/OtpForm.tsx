"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendOtpAction } from "@/features/auth/actions/sendOtp";
import { verifyOtpAction } from "@/features/auth/actions/verifyOtp";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { Button } from "@/shared/ui/atoms/Button/Button";
import { InputField } from "@/shared/ui/atoms/InputField/InputField";

function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="rounded-[var(--sds-size-radius-200,8px)] bg-[#fee2e2] p-[var(--sds-size-space-400,16px)]">
      <p className="font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] text-[length:var(--sds-typography-body-size-small,14px)] leading-[1.4] text-[color:var(--sds-color-text-danger-default,#900b09)]">
        {error}
      </p>
    </div>
  );
}

function EmailStep({
  onSubmit,
  isLoading,
  error,
}: {
  onSubmit: (email: string) => void;
  isLoading: boolean;
  error: string | null;
}) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    if (!email) {
      setEmailError("メールアドレスを入力してください");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("有効なメールアドレスを入力してください");
      return;
    }

    onSubmit(email);
  };

  return (
    <div className="flex flex-col gap-[var(--sds-size-space-600,24px)]">
      <p className="text-center font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] text-[length:var(--sds-typography-body-size-small,14px)] leading-[1.4] text-[color:var(--sds-color-text-default-secondary,#757575)]">
        メールアドレスを入力すると、6桁の認証コードが送信されます。
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[var(--sds-size-space-600,24px)]"
      >
        <InputField
          id="otp-email"
          label="メールアドレス"
          type="email"
          placeholder="email@example.com"
          disabled={isLoading}
          hasError={!!emailError}
          error={emailError || undefined}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <ErrorMessage error={error} />}
        <Button
          id="otp-send-button"
          type="submit"
          variant="primary"
          size="medium"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "送信中..." : "認証コードを送信"}
        </Button>
      </form>
    </div>
  );
}

function CodeStep({
  email,
  onSubmit,
  onBack,
  isLoading,
  error,
}: {
  email: string;
  onSubmit: (code: string) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}) {
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError(null);

    if (!code) {
      setCodeError("コードを入力してください");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setCodeError("6桁の数字を入力してください");
      return;
    }

    onSubmit(code);
  };

  return (
    <div className="flex flex-col gap-[var(--sds-size-space-600,24px)]">
      <div className="rounded-[var(--sds-size-radius-200,8px)] bg-[#dcfce7] p-[var(--sds-size-space-400,16px)]">
        <p className="font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] text-[length:var(--sds-typography-body-size-small,14px)] leading-[1.4] text-[color:var(--sds-color-text-success-default,#166534)]">
          {email} に認証コードを送信しました。
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[var(--sds-size-space-600,24px)]"
      >
        <InputField
          id="otp-code"
          label="認証コード"
          type="text"
          inputMode="numeric"
          placeholder="000000"
          maxLength={6}
          disabled={isLoading}
          hasError={!!codeError}
          error={codeError || undefined}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
        {error && <ErrorMessage error={error} />}
        <Button
          id="otp-verify-button"
          type="submit"
          variant="primary"
          size="medium"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "認証中..." : "ログイン"}
        </Button>
      </form>
      <button
        type="button"
        onClick={onBack}
        className="text-center font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] text-[length:var(--sds-typography-body-size-small,14px)] leading-[1.4] text-[color:var(--sds-color-text-brand-default,#0066cc)] hover:underline"
      >
        別のメールアドレスを使用
      </button>
    </div>
  );
}

export function OtpForm() {
  const router = useRouter();
  const isLoading = useAuthStore((state) => state.isLoading);
  const otpSent = useAuthStore((state) => state.otpSent);
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const error = useAuthStore((state) => state.error);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const setOtpSent = useAuthStore((state) => state.setOtpSent);
  const resetOtpFlow = useAuthStore((state) => state.resetOtpFlow);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const clearError = useAuthStore((state) => state.clearError);

  const handleSendOtp = async (email: string) => {
    clearError();
    setLoading(true);

    const result = await sendOtpAction({ email });

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.fieldErrors?.email?.[0]) {
      setError(result.fieldErrors.email[0]);
      return;
    }

    if (result.success) {
      setOtpSent(email);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (!pendingEmail) return;

    clearError();
    setLoading(true);

    const result = await verifyOtpAction({ email: pendingEmail, code });

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.fieldErrors?.code?.[0]) {
      setError(result.fieldErrors.code[0]);
      return;
    }

    if (result.success && result.user) {
      setAuthenticated(result.user, ""); // accessTokenはcookieに保存済み
      if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    }
  };

  const handleBack = () => {
    resetOtpFlow();
  };

  if (otpSent && pendingEmail) {
    return (
      <CodeStep
        email={pendingEmail}
        onSubmit={handleVerifyOtp}
        onBack={handleBack}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <EmailStep onSubmit={handleSendOtp} isLoading={isLoading} error={error} />
  );
}
