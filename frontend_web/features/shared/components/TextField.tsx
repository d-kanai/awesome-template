import { Input } from "@/features/shared/figma_generated/Input";
import { Label } from "@/features/shared/figma_generated/Label";
import { forwardRef } from "react";

export type TextFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  disabled?: boolean;
  placeholder?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    { id, label, type = "text", disabled, placeholder, error, ...rest },
    ref,
  ) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          type={type}
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
          {...rest}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

TextField.displayName = "TextField";
