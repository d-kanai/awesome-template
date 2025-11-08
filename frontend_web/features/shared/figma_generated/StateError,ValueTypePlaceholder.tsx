import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * StateError,ValueTypePlaceholder コンポーネント
 *
 * 説明なし
 *
 * @figma 622:21385
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.406Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface StateError,ValueTypePlaceholderProps extends ComponentPropsWithoutRef<"div"> {}

export function StateError,ValueTypePlaceholder({
  className,
  children,
  ...props
}: StateError,ValueTypePlaceholderProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
