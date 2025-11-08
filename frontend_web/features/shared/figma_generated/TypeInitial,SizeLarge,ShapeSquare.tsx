import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * TypeInitial,SizeLarge,ShapeSquare コンポーネント
 *
 * 説明なし
 *
 * @figma 9762:1119
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.401Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface TypeInitial,SizeLarge,ShapeSquareProps extends ComponentPropsWithoutRef<"div"> {}

export function TypeInitial,SizeLarge,ShapeSquare({
  className,
  children,
  ...props
}: TypeInitial,SizeLarge,ShapeSquareProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
