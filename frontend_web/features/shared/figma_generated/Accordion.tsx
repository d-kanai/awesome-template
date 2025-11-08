import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * Accordion コンポーネント
 *
 * Keywords: disclosure, collapse, expand, toggle, expandable, expander
 *
 * @figma 7753:4779
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.412Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface AccordionProps extends ComponentPropsWithoutRef<"div"> {}

export function Accordion({
  className,
  children,
  ...props
}: AccordionProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
