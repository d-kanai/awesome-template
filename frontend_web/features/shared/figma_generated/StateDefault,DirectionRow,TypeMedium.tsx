import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * StateDefault,DirectionRow,TypeMedium コンポーネント
 *
 * 説明なし
 *
 * @figma 515:8821
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.408Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface StateDefault,DirectionRow,TypeMediumProps extends ComponentPropsWithoutRef<"div"> {}

export function StateDefault,DirectionRow,TypeMedium({
  className,
  children,
  ...props
}: StateDefault,DirectionRow,TypeMediumProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
