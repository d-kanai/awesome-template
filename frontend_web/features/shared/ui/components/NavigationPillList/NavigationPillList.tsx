"use client";

import React from "react";
import { cn } from "@/features/shared/lib/utils";
import { NavigationPill, NavigationPillState } from "../../atoms/NavigationPill";

export type NavigationPillListDirection = "Row" | "Column";

export interface NavigationPillListItem {
  label: string;
  state?: NavigationPillState;
  onClick?: () => void;
}

export interface NavigationPillListProps {
  items?: NavigationPillListItem[];
  direction?: NavigationPillListDirection;
  className?: string;
}

const defaultItems: NavigationPillListItem[] = [
  { label: "Products", state: "Active" },
  { label: "Solutions" },
  { label: "Community" },
  { label: "Resources" },
  { label: "Pricing" },
  { label: "Contact" },
  { label: "Link" },
];

export function NavigationPillList({
  items = defaultItems,
  direction = "Row",
  className,
}: NavigationPillListProps) {
  if (direction === "Column") {
    return (
      <nav
        className={cn(
          "flex flex-col items-start content-stretch",
          "gap-[var(--sds-size-space-200,8px)]",
          "w-[115px]",
          className,
        )}
      >
        {items.map((item, index) => (
          <NavigationPill
            key={index}
            label={item.label}
            state={item.state}
            onClick={item.onClick}
            className="w-full"
          />
        ))}
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        "flex flex-wrap items-start content-start",
        "gap-[var(--sds-size-space-200,8px)]",
        className,
      )}
    >
      {items.map((item, index) => (
        <NavigationPill
          key={index}
          label={item.label}
          state={item.state}
          onClick={item.onClick}
        />
      ))}
    </nav>
  );
}
