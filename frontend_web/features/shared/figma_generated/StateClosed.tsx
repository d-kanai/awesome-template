import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * StateClosed コンポーネント
 *
 * 説明なし
 *
 * @figma 7723:4485
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.409Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface StateClosedProps extends ComponentPropsWithoutRef<"div"> {}

export function StateClosed({
  className,
  children,
  ...props
}: StateClosedProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
