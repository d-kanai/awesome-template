import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * SchemeNeutral,StateHover,VariantSecondary コンポーネント
 *
 * 説明なし
 *
 * @figma 56:9870
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.404Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface SchemeNeutral,StateHover,VariantSecondaryProps extends ComponentPropsWithoutRef<"div"> {}

export function SchemeNeutral,StateHover,VariantSecondary({
  className,
  children,
  ...props
}: SchemeNeutral,StateHover,VariantSecondaryProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
