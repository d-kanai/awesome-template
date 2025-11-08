import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * StateHover,DirectionColumn,TypeMedium コンポーネント
 *
 * 説明なし
 *
 * @figma 515:8824
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.408Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface StateHover,DirectionColumn,TypeMediumProps extends ComponentPropsWithoutRef<"div"> {}

export function StateHover,DirectionColumn,TypeMedium({
  className,
  children,
  ...props
}: StateHover,DirectionColumn,TypeMediumProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
