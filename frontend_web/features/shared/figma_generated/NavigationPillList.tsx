import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/features/shared/lib/classNames";
import { NavigationPill } from "./NavigationPill";

/**
 * NavigationPillList コンポーネント
 *
 * Navigation Pillのコンテナコンポーネント
 * Auto Layout情報から自動生成
 *
 * @figma 2194:14984
 * @generated Figma REST API + Auto Layout
 */

export interface NavigationPillListProps extends ComponentPropsWithoutRef<"nav"> {
  items?: Array<{
    label: string;
    href?: string;
    active?: boolean;
    onClick?: () => void;
  }>;
  direction?: "row" | "column";
  children?: ReactNode;
}

export const NavigationPillList = forwardRef<HTMLElement, NavigationPillListProps>(
  function NavigationPillList(
    {
      className,
      items,
      direction = "row",
      children,
      ...props
    },
    ref,
  ) {
    const directionClass = direction === "column" ? "flex-col" : "flex-row";

    return (
      <nav
        ref={ref}
        className={cn("flex flex-row gap-Space-200", directionClass, className)}
        {...props}
      >
        {items ? (
          items.map((item, index) => (
            item.href ? (
              <a key={index} href={item.href}>
                <NavigationPill
                  state={item.active ? "active" : "default"}
                  label={item.label}
                />
              </a>
            ) : (
              <NavigationPill
                key={index}
                state={item.active ? "active" : "default"}
                label={item.label}
                onClick={item.onClick}
              />
            )
          ))
        ) : (
          children
        )}
      </nav>
    );
  },
);
