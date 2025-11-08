import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * Menu コンポーネント
 *
 * This is an example of a composed menu.

If you require a different composition, you can build one using the Primitives.

Keywords: popover
 *
 * @figma 9762:720
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.412Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface MenuProps extends ComponentPropsWithoutRef<"div"> {}

export function Menu({
  className,
  children,
  ...props
}: MenuProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
