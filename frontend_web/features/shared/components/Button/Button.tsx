"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export type ButtonVariant = "primary" | "neutral" | "subtle";
export type ButtonSize = "small" | "medium";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "medium",
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles = cn(
      // Base styles
      "inline-flex items-center justify-center gap-2",
      "rounded-lg border border-solid",
      "text-base font-normal leading-none",
      "transition-colors duration-200",
      "disabled:cursor-not-allowed",

      // Size variants
      size === "medium" && "px-3 py-3",
      size === "small" && "px-2 py-2",

      // Variant styles
      variant === "primary" && [
        "bg-[var(--sds-color-background-brand-default)] border-[var(--sds-color-border-brand-default)] text-[var(--sds-color-text-brand-on-brand)]",
        "hover:bg-[var(--sds-color-background-brand-hover)]",
        "disabled:bg-[var(--sds-color-background-disabled-default)] disabled:border-[var(--sds-color-border-disabled-default)] disabled:text-[var(--sds-color-text-disabled-on-disabled)]",
      ],
      variant === "neutral" && [
        "bg-[var(--sds-color-background-neutral-tertiary)] border-[var(--sds-color-border-neutral-secondary)] text-[var(--sds-color-text-default-default)]",
        "hover:bg-[var(--sds-color-background-neutral-tertiary-hover)]",
        "disabled:bg-[var(--sds-color-background-disabled-default)] disabled:border-[var(--sds-color-border-disabled-default)] disabled:text-[var(--sds-color-text-disabled-on-disabled)]",
      ],
      variant === "subtle" && [
        "bg-transparent border-transparent text-[var(--sds-color-text-neutral-default)]",
        "hover:border-[var(--sds-color-border-default-default)] hover:text-[var(--sds-color-text-default-default)]",
        "disabled:bg-[var(--sds-color-background-disabled-default)] disabled:border-[var(--sds-color-border-disabled-default)] disabled:text-[var(--sds-color-text-disabled-on-disabled)]",
      ],

      className,
    );

    return (
      <button ref={ref} className={baseStyles} disabled={disabled} {...props}>
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children && <span>{children}</span>}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
