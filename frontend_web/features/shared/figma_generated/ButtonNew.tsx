import type { ComponentPropsWithoutRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/lib/classNames";

/**
 * ButtonNew コンポーネント
 *
 * 説明なし
 *
 * @figma 185:865
 * @generated Figma API から自動生成 (2025-11-08T07:55:16.361Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

const buttonnewVariants = cva(
  "inline-flex items-center justify-center rounded-md text-body-small-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-ring",
        subtle: "bg-secondary text-secondary-foreground hover:bg-secondary-hover focus-visible:ring-ring",
        neutral: "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
      },
      state: {
        default: "",
        hover: "",
        disabled: "opacity-50 cursor-not-allowed",
      },
      size: {
        medium: "h-10 px-Space-400 py-Space-200",
        small: "h-9 px-Space-300 text-body-small",
      }
    },
    defaultVariants: {
      variant: "primary",
      state: "default",
      size: "medium"
    },
  },
);

export interface ButtonNewProps extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonnewVariants> {
  label?: string;
  iconEnd?: React.ReactNode;
  hasIconEnd?: boolean;
  hasIconStart?: boolean;
  iconStart?: React.ReactNode;
}

export function ButtonNew({
  className,
  label,
  iconEnd,
  hasIconEnd,
  hasIconStart,
  iconStart,
  variant,
  state,
  size,
  disabled,
  children,
  ...props
}: ButtonNewProps) {
  const isDisabled = disabled || state === "disabled";
  const content = label || children;
  const showIconStart = iconStart || hasIconStart;
  const showIconEnd = iconEnd || hasIconEnd;

  return (
    <button
      className={cn(buttonnewVariants({ variant, state, size, className }))}
      disabled={isDisabled}
      {...props}
    >
      {showIconStart && <span className="mr-Space-150" aria-hidden="true">{iconStart || "→"}</span>}
      {content}
      {showIconEnd && <span className="ml-Space-150" aria-hidden="true">{iconEnd || "←"}</span>}
    </button>
  );
}
