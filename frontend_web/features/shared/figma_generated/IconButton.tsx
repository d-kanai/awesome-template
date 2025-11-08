import type { ComponentPropsWithoutRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/lib/classNames";

/**
 * IconButton コンポーネント
 *
 * アイコンのみを表示する正方形ボタン
 *
 * @figma 11:11509
 * @generated Figma API から自動生成 (2025-11-08T07:55:16.360Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

const iconbuttonVariants = cva(
  "",
  {
    variants: {
      variant: {
        primary: "",
        neutral: "",
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

export interface IconButtonProps extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof iconbuttonVariants> {
  icon: React.ReactNode;
  "aria-label": string;
}

export function IconButton({
  className,
  variant, state, size,
  icon,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(iconbuttonVariants({ variant, state, size, className }))}
      {...props}
    >
      {icon}
    </button>
  );
}
