import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * FormForgotPassword コンポーネント
 *
 * 説明なし
 *
 * @figma 197:19744
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.412Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface FormForgotPasswordProps extends ComponentPropsWithoutRef<"div"> {}

export function FormForgotPassword({
  className,
  children,
  ...props
}: FormForgotPasswordProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
