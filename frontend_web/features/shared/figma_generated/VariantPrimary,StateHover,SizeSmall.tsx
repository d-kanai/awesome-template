import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * VariantPrimary,StateHover,SizeSmall コンポーネント
 *
 * 説明なし
 *
 * @figma 185:985
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.409Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface VariantPrimary,StateHover,SizeSmallProps extends ComponentPropsWithoutRef<"div"> {}

export function VariantPrimary,StateHover,SizeSmall({
  className,
  children,
  ...props
}: VariantPrimary,StateHover,SizeSmallProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
