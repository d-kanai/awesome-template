"use client";

import React, { forwardRef, useEffect, useRef } from "react";
import { cn } from "@/features/shared/lib/utils";

export interface CheckboxFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  (
    {
      label,
      description,
      indeterminate = false,
      disabled,
      checked,
      className,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const checkboxRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    // Handle indeterminate state
    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, checkboxRef]);

    const containerStyles = cn(
      "flex flex-col items-start w-full max-w-[240px]",
      className,
    );

    const checkboxWrapperStyles = cn(
      "flex gap-[var(--sds-size-space-300,12px)] items-center w-full",
    );

    const checkboxStyles = cn(
      // Base styles
      "relative shrink-0 size-[16px]",
      "rounded-[var(--sds-size-radius-100,4px)]",
      "border-[length:var(--sds-size-stroke-border,1px)] border-solid",
      "appearance-none cursor-pointer",
      "transition-colors duration-200",

      // Unchecked state
      "bg-[var(--sds-color-background-default-default,#ffffff)]",
      "border-[color:var(--sds-color-border-brand-tertiary,#757575)]",

      // Checked state
      "checked:bg-[var(--sds-color-background-brand-default,#2c2c2c)]",
      "checked:border-[color:var(--sds-color-background-brand-default,#2c2c2c)]",

      // Indeterminate state (via pseudo-class)
      "indeterminate:bg-[var(--sds-color-background-brand-default,#2c2c2c)]",
      "indeterminate:border-[color:var(--sds-color-background-brand-default,#2c2c2c)]",

      // Disabled state
      "disabled:cursor-not-allowed",
      "disabled:bg-[var(--sds-color-background-disabled-default,#d9d9d9)]",
      "disabled:border-[color:var(--sds-color-border-disabled-secondary,#b2b2b2)]",

      // Check mark styling (using background-image for checkmark)
      "checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMiAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjY2NjcgMS41TDQgOC4xNjY2N0wxLjMzMzMzIDUuNSIgc3Ryb2tlPSIjRjVGNUY1IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')]",
      "checked:bg-center checked:bg-no-repeat",

      // Indeterminate mark styling (minus sign)
      "indeterminate:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMiIgdmlld0JveD0iMCAwIDEwIDIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik05IDFIMSI gc3Ryb2tlPSIjRjVGNUY1IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=')]",
      "indeterminate:bg-center indeterminate:bg-no-repeat",

      // Disabled check/indeterminate mark color (gray)
      "disabled:checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMiAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjY2NjcgMS41TDQgOC4xNjY2N0wxLjMzMzMzIDUuNSIgc3Ryb2tlPSIjQjNCM0IzIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')]",
      "disabled:indeterminate:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMiIgdmlld0JveD0iMCAwIDEwIDIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik05IDFIMSI gc3Ryb2tlPSIjQjNCM0IzIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=')]",
    );

    const labelStyles = cn(
      "flex-1",
      "font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)]",
      "font-[var(--sds-typography-body-font-weight-regular,400)]",
      "text-[length:var(--sds-typography-body-size-medium,16px)]",
      "leading-[1.4]",
      "text-[color:var(--sds-color-text-default-default,#1e1e1e)]",
      disabled && "cursor-not-allowed",
    );

    const descriptionRowStyles = cn(
      "flex gap-[var(--sds-size-space-300,12px)] items-center w-full",
      disabled && "opacity-50",
    );

    const descriptionStyles = cn(
      "flex-1",
      "font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)]",
      "font-[var(--sds-typography-body-font-weight-regular,400)]",
      "text-[length:var(--sds-typography-body-size-medium,16px)]",
      "leading-[1.4]",
      "text-[color:var(--sds-color-text-default-secondary,#757575)]",
    );

    return (
      <div className={containerStyles}>
        <label className={checkboxWrapperStyles}>
          <input
            ref={checkboxRef}
            type="checkbox"
            className={checkboxStyles}
            disabled={disabled}
            checked={checked}
            {...props}
          />
          {label && <span className={labelStyles}>{label}</span>}
        </label>
        {description && (
          <div className={descriptionRowStyles}>
            <div className="shrink-0 size-[16px]" aria-hidden="true" />
            <p className={descriptionStyles}>{description}</p>
          </div>
        )}
      </div>
    );
  },
);

CheckboxField.displayName = "CheckboxField";
