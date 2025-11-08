import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/lib/classNames";

/**
 * NavigationPill コンポーネント
 *
 * ナビゲーション用のピル型ボタン
 * Auto Layout情報から自動生成
 *
 * @figma 7768:19970
 * @generated Figma REST API + Auto Layout
 */

export interface NavigationPillProps
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof navigationPillVariants> {
  label?: string;
  state?: "active" | "default" | "hover";
}

const navigationPillVariants = cva(
  "flex flex-row gap-Space-200 items-center justify-center p-Space-200 rounded-lg transition-colors",
  {
    variants: {
      state: {
        active: "bg-accent text-foreground",
        default: "bg-transparent text-foreground hover:bg-accent",
        hover: "bg-accent text-foreground",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

export const NavigationPill = forwardRef<HTMLButtonElement, NavigationPillProps>(
  function NavigationPill(
    {
      className,
      state = "default",
      label,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(navigationPillVariants({ state, className }))}
        {...props}
      >
        <span className="text-body-small">{label || children}</span>
      </button>
    );
  },
);
