import { SignupForm } from "../components/SignupForm";

function ScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--sds-color-background-default-secondary,#f5f5f5)]">
      <div className="flex flex-1 items-center justify-center p-[var(--sds-size-space-600,24px)]">
        {children}
      </div>
    </div>
  );
}

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md bg-[var(--sds-color-background-default-default,#ffffff)] border-[var(--sds-color-border-default-default,#d9d9d9)] border-[var(--sds-size-stroke-border,1px)] border-solid rounded-[var(--sds-size-radius-200,8px)] p-[var(--sds-size-space-600,24px)]">
      {children}
    </div>
  );
}

function Header() {
  return (
    <div className="mb-[var(--sds-size-space-600,24px)]">
      <h1 className="font-[family-name:var(--sds-typography-heading-font-family,'Inter',sans-serif)] font-[var(--sds-typography-heading-font-weight,600)] text-[length:var(--sds-typography-heading-size-base,24px)] leading-[1.2] tracking-[-0.48px] text-[color:var(--sds-color-text-default-default,#1e1e1e)] text-center">
        サインアップ
      </h1>
    </div>
  );
}

function Content() {
  return (
    <div>
      <SignupForm />
    </div>
  );
}

export function SignupScreen() {
  return (
    <ScreenContainer>
      <FormCard>
        <Header />
        <Content />
      </FormCard>
    </ScreenContainer>
  );
}
