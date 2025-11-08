import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";

/**
 * Dialog コンポーネント
 *
 * A precomposed full screen dialog, containing a swappable body.

It contains a semi-transparent scrim fill to obscure the content underneath.

Keywords: overlay, window, dialog, popup
 *
 * @figma 192:31534
 * @generated Figma API から自動生成 (2025-11-08T06:44:52.412Z)
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */

export interface DialogProps extends ComponentPropsWithoutRef<"div"> {}

export function Dialog({
  className,
  children,
  ...props
}: DialogProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
