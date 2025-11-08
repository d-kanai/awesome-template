import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * VariantSubtle,StateDefault,SizeSmall コンポーネント
 *
 * 説明なし
 *
 * @figma 185:1061
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.408Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface VariantSubtle,StateDefault,SizeSmallProps extends ComponentPropsWithoutRef<"div"> {}

export function VariantSubtle,StateDefault,SizeSmall({
  className,
  children,
  ...props
}: VariantSubtle,StateDefault,SizeSmallProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
