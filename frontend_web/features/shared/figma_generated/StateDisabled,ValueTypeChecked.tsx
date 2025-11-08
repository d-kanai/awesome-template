import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * StateDisabled,ValueTypeChecked コンポーネント
 *
 * 説明なし
 *
 * @figma 565:15661
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.409Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface StateDisabled,ValueTypeCheckedProps extends ComponentPropsWithoutRef<"div"> {}

export function StateDisabled,ValueTypeChecked({
  className,
  children,
  ...props
}: StateDisabled,ValueTypeCheckedProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
