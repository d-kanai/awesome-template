/**
 * ============================================
 * 🎨 ButtonDanger
 * 📅 Synced at: 2025-11-12 JST
 * 🔗 Figma Raw: features/shared/ui/figma_generated/atoms/ButtonDanger/ButtonDanger.figma-raw.tsx
 * ============================================
 */
"use client";

import React, { forwardRef } from "react";
import { cn } from "@/shared/lib/classNames";
import { sendClickEvent } from "@/shared/lib/clickTracker";
import { getNow } from "@/shared/lib/dateTime";

export type ButtonDangerVariant = "primary" | "subtle";
export type ButtonDangerSize = "small" | "medium";

export interface ButtonDangerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "id"> {
  /** Required button ID for click event logging */
  id: string;
  variant?: ButtonDangerVariant;
  size?: ButtonDangerSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  /** Enable/disable click tracking (default: true) */
  trackClick?: boolean;
}

export const ButtonDanger = forwardRef<HTMLButtonElement, ButtonDangerProps>(
  (
    {
      variant = "primary",
      size = "medium",
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      trackClick = true,
      onClick,
      id,
      ...props
    },
    ref,
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Send click event if enabled and not disabled
      if (trackClick && !disabled) {
        sendClickEvent({
          id,
          label: typeof children === "string" ? children : undefined,
          pathname: window.location.pathname,
          timestamp: getNow().toISOString(),
        });
      }
      onClick?.(e);
    };

    const baseStyles = cn(
      // Base styles - using semantic tokens
      "inline-flex items-center justify-center",
      "gap-[var(--sds-size-space-200,8px)]",
      "rounded-[var(--sds-size-radius-200,8px)]",
      "border-solid",
      "border-[length:var(--sds-size-stroke-border,1px)]",
      "font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)]",
      "font-[var(--sds-typography-body-font-weight-regular,400)]",
      "text-[length:var(--sds-typography-body-size-medium,16px)]",
      "leading-none",
      "transition-colors duration-200",
      "disabled:cursor-not-allowed",

      // Size variants - using semantic tokens
      size === "medium" && "p-[var(--sds-size-space-300,12px)]",
      size === "small" && "p-[var(--sds-size-space-200,8px)]",

      // Variant styles - using semantic tokens
      variant === "primary" && [
        "bg-[var(--sds-color-background-danger-default,#ec221f)] border-[color:var(--sds-color-border-danger-secondary,#c00f0c)] text-[color:var(--sds-color-text-danger-on-danger,#fee9e7)]",
        "hover:bg-[var(--sds-color-background-danger-hover,#c00f0c)] hover:border-[color:var(--sds-color-border-danger-default,#900b09)]",
        "disabled:bg-[var(--sds-color-background-disabled-default,#d9d9d9)] disabled:border-[color:var(--sds-color-border-disabled-default,#b3b3b3)] disabled:text-[color:var(--sds-color-text-disabled-on-disabled,#b3b3b3)]",
      ],
      variant === "subtle" && [
        "bg-transparent border-transparent text-[color:var(--sds-color-text-danger-default,#900b09)]",
        "hover:bg-[var(--sds-color-background-danger-tertiary-hover,#fdd3d0)] hover:border-[color:var(--sds-color-border-danger-default,#900b09)]",
        "disabled:bg-[var(--sds-color-background-disabled-default,#d9d9d9)] disabled:border-[color:var(--sds-color-border-disabled-default,#b3b3b3)] disabled:text-[color:var(--sds-color-text-disabled-default,#b3b3b3)]",
      ],

      className,
    );

    return (
      <button
        ref={ref}
        id={id}
        className={baseStyles}
        disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children && <span>{children}</span>}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

ButtonDanger.displayName = "ButtonDanger";
