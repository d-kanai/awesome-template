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
  "",
  {
    variants: {
      variant: {
        primary: "",
        subtle: "",
      },
      state: {
        default: "",
        hover: "",
        disabled: "",
      },
      size: {
        medium: "",
        small: "",
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
