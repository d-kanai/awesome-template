/**
 * Button Component - Figmaから取り込み
 *
 * Generated from Figma
 * Node ID: 4185:3778
 * Size: 345x456px (18 variants)
 *
 * Figma Variants:
 * - Variant: Primary, Neutral, Subtle
 * - State: Default, Hover, Disabled
 * - Size: Medium, Small
 *
 * Variables used:
 * - Background: Brand Default (#2c2c2c), Brand Hover (#1e1e1e), Neutral Tertiary (#e3e3e3),
 *               Neutral Tertiary Hover (#cdcdcd), Disabled (#d9d9d9)
 * - Text: Brand On Brand (#f5f5f5), Default (#1e1e1e), Neutral Default (#303030), Disabled (#b3b3b3)
 * - Border: Brand Default (#2c2c2c), Neutral Secondary (#767676), Default (#d9d9d9), Disabled (#b3b3b3)
 * - Spacing: Space-200 (8px), Space-300 (12px)
 * - Border Radius: Radius-200 (8px)
 */

import React from "react";

type ButtonFigmaProps = {
  variant?: "primary" | "neutral" | "subtle";
  state?: "default" | "hover" | "disabled";
  size?: "medium" | "small";
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export function ButtonFigma({
  variant = "primary",
  state = "default",
  size = "medium",
  children = "Button",
  className = "",
  onClick,
  disabled = false,
  type = "button",
}: ButtonFigmaProps) {
  // Variantベースのスタイル（セマンティック変数を使用してダークモード対応）
  const getVariantStyles = (): string => {
    const actualState = disabled ? "disabled" : state;

    // Primary Variant
    if (variant === "primary") {
      switch (actualState) {
        case "disabled":
          return "bg-disabled border-disabled-border text-disabled-foreground cursor-not-allowed";
        case "hover":
          return "bg-primary-hover border-primary text-primary-foreground";
        case "default":
        default:
          return "bg-primary border-primary text-primary-foreground hover:bg-primary-hover";
      }
    }

    // Neutral Variant
    if (variant === "neutral") {
      switch (actualState) {
        case "disabled":
          return "bg-disabled border-disabled-border text-disabled-foreground cursor-not-allowed";
        case "hover":
          return "bg-neutral-hover border-neutral-border text-neutral-foreground";
        case "default":
        default:
          return "bg-neutral border-neutral-border text-neutral-foreground hover:bg-neutral-hover";
      }
    }

    // Subtle Variant
    if (variant === "subtle") {
      switch (actualState) {
        case "disabled":
          return "bg-disabled border-disabled-border text-disabled-foreground cursor-not-allowed";
        case "hover":
          return "bg-subtle-hover border-subtle-border-hover text-subtle-foreground-hover";
        case "default":
        default:
          return "bg-subtle border-subtle-border text-subtle-foreground hover:border-subtle-border-hover hover:text-subtle-foreground-hover";
      }
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
    "box-border border border-solid rounded-lg flex gap-Space-200 items-center justify-center font-sans font-normal text-base leading-none whitespace-nowrap transition-colors overflow-clip";

  const combinedClassName = `${baseStyles} ${getVariantStyles()} ${getSizeStyles()} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || state === "disabled"}
      className={combinedClassName}
    >
      {children}
    </button>
  );
}
