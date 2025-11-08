import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * SchemeBrand,StateDefault,VariantPrimary コンポーネント
 *
 * 説明なし
 *
 * @figma 56:8833
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.403Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface SchemeBrand,StateDefault,VariantPrimaryProps extends ComponentPropsWithoutRef<"div"> {}

export function SchemeBrand,StateDefault,VariantPrimary({
  className,
  children,
  ...props
}: SchemeBrand,StateDefault,VariantPrimaryProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
