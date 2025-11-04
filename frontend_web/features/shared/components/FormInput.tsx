import { Input } from "@/features/shared/figma_generated/Input";
import { Label } from "@/features/shared/figma_generated/Label";

/**
 * FormInput コンポーネント
 * Label + Input + エラー表示を組み合わせた自作コンポーネント
 * TanStack Formと統合して使用
 */

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  htmlFor?: string;
}

export function FormInput({
  label,
  error,
  htmlFor,
  id,
  ...props
}: FormInputProps) {
  const inputId = htmlFor || id;

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Input id={inputId} {...props} />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
