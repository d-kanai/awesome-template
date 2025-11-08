import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * VariantNeutral,StateDisabled,SizeSmall コンポーネント
 *
 * 説明なし
 *
 * @figma 34:12274
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.400Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface VariantNeutral,StateDisabled,SizeSmallProps extends ComponentPropsWithoutRef<"div"> {}

export function VariantNeutral,StateDisabled,SizeSmall({
  className,
  children,
  ...props
}: VariantNeutral,StateDisabled,SizeSmallProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
