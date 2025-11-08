import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/lib/classNames";

export interface InputFieldProps
  extends ComponentPropsWithoutRef<"input">,
    VariantProps<typeof inputFieldVariants> {
  hasLabel?: boolean;
  label?: string;
  hasError?: boolean;
  error?: string;
  hasDescription?: boolean;
  description?: string;
  value?: string;
}

const inputFieldVariants = cva("", {
  variants: {
    state: {
      default: "",
      error: "",
      disabled: "",
    },
    valueType: {
      default: "",
      placeholder: "",
    },
  },
  defaultVariants: {
    state: "default",
    valueType: "default",
  },
});

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    {
      className,
      hasLabel,
      label = "Label",
      hasError,
      error = "Error message",
      hasDescription,
      description = "Description",
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
            inputFieldVariants({ state, valueType, className }),
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
)
