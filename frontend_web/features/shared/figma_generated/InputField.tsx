import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/lib/classNames";

/**
 * InputField コンポーネント
 *
 * ラベル、説明、エラーメッセージを含むフォーム入力フィールド
 *
 * @figma 622:21367
 * @generated Figma API から自動生成 (2025-11-08T07:55:16.361Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

const inputfieldVariants = cva(
  "",
  {
    variants: {
      state: {
        default: "",
        error: "",
        disabled: "",
      },
      valueType: {
        default: "",
        placeholder: "",
      }
    },
    defaultVariants: {
      state: "default",
      valueType: "default"
    },
  },
);

export interface InputFieldProps extends ComponentPropsWithoutRef<"input">,
    VariantProps<typeof inputfieldVariants> {
  hasLabel?: boolean;
  hasError?: boolean;
  label?: string;
  error?: string;
  open?: boolean;
  description?: string;
  hasDescription?: boolean;
  value?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    {
      className,
      hasLabel,
      hasError,
      label = "Label",
      error = "Error message",
      open,
      description = "Description",
      hasDescription,
      value = "Value",
      state,
      valueType,
      disabled,
      ...props
    },
    ref,
  ) {
    const showError = state === "error" && hasError;
    const isDisabled = disabled || state === "disabled";

    return (
      <div className="space-y-Space-100">
        {hasLabel && (
          <label className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-md border px-Space-300 py-Space-200 text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            state === "error" ? "border-destructive" : "border-border",
            isDisabled &&
              "cursor-not-allowed bg-sds_light-Background-Disabled-Default border-sds_light-Border-Disabled-default text-sds_light-Text-Disabled-On-Disabled",
            inputfieldVariants({ state, valueType, className }),
          )}
          placeholder={valueType === "placeholder" ? value : undefined}
          defaultValue={valueType === "default" ? value : undefined}
          disabled={isDisabled}
          aria-invalid={showError}
          aria-describedby={
            showError
              ? "error-message"
              : hasDescription
                ? "description"
                : undefined
          }
          {...props}
        />
        {hasDescription && !showError && (
          <p id="description" className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {showError && (
          <p id="error-message" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  },
);
