/**
 * ============================================
 * 🎨 Generated from Figma
 * 📅 Generated at: 2025-11-09 09:01:22 JST
 * 🔗 Node ID: 4185:3778
 * ============================================
 *
 * Button With Icons Component
 *
 * Size: 345x456px (18 variants)
 *
 * Figma Variants:
 * - Variant: Primary, Neutral, Subtle
 * - State: Default, Hover, Disabled
 * - Size: Medium, Small
 *
 * Features:
 * - Left/Right icon support
 * - Semantic variables for dark mode
 * - Full accessibility support
 * - forwardRef support
 */

import React from "react";

type ButtonWithIconsProps = {
  variant?: "primary" | "neutral" | "subtle";
  size?: "medium" | "small";
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
};

const ButtonWithIcons = React.forwardRef<HTMLButtonElement, ButtonWithIconsProps>(
  (
    {
      variant = "primary",
      size = "medium",
      children = "Button",
      leftIcon,
      rightIcon,
      className = "",
      onClick,
      onFocus,
      onBlur,
      disabled = false,
      type = "button",
      "aria-label": ariaLabel,
    },
    ref
  ) => {
  // Variantベースのスタイル（セマンティック変数を使用してダークモード対応）
  const getVariantStyles = (): string => {
    if (disabled) {
      return "bg-disabled border-disabled-border text-disabled-foreground cursor-not-allowed";
    }

    // Primary Variant
    if (variant === "primary") {
      return "bg-primary border-primary text-primary-foreground hover:bg-primary-hover transition-colors";
    }

    // Neutral Variant
    if (variant === "neutral") {
      return "bg-neutral border-neutral-border text-neutral-foreground hover:bg-neutral-hover transition-colors";
    }

    // Subtle Variant
    if (variant === "subtle") {
      return "bg-subtle border-subtle-border text-subtle-foreground hover:border-subtle-border-hover hover:text-subtle-foreground-hover transition-colors";
    }

    return "";
  };

  // Sizeベースのスタイル
  const getSizeStyles = (): string => {
    if (size === "small") {
      return "p-Space-200"; // 8px
    }
    return "p-Space-300"; // 12px
  };

  // ベーススタイル
  const baseStyles =
    "box-border border border-solid rounded-lg flex gap-Space-200 items-center justify-center font-sans font-normal text-base leading-none whitespace-nowrap overflow-clip";

  const combinedClassName = `${baseStyles} ${getVariantStyles()} ${getSizeStyles()} ${className}`.trim();

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className={combinedClassName}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        data-node-id="4185:3778"
      >
        {leftIcon && (
          <span className="shrink-0 size-4 flex items-center justify-center">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className="shrink-0 size-4 flex items-center justify-center">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

ButtonWithIcons.displayName = "ButtonWithIcons";

export default ButtonWithIcons;
