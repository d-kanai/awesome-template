/**
 * ============================================
 * 🎨 Generated from Figma
 * 📅 Synced at: 2025-11-09 15:30:00 JST
 * 🔗 Node ID: 2153-7973
 * 🔗 Figma URL: https://www.figma.com/design/WoOuJeIanK8Ke56zr6muug/Simple-Design-System--Community-?node-id=2153-7973
 * ============================================
 */
"use client";

import React, { forwardRef } from "react";
import { cn } from "@/shared/lib/utils";

export interface TextLinkListItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  className?: string;
}

export const TextLinkListItem = forwardRef<
  HTMLButtonElement,
  TextLinkListItemProps
>(({ text = "List item", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "flex flex-col justify-center",
        "font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)]",
        "font-[var(--sds-typography-body-font-weight-regular,400)]",
        "text-[length:var(--sds-typography-body-size-medium,16px)]",
        "leading-[0]",
        "text-[color:var(--sds-color-text-default-default,#1e1e1e)]",
        "text-left",
        className,
      )}
      {...props}
    >
      <p className="leading-[1.4] whitespace-pre">{text}</p>
    </button>
  );
});

TextLinkListItem.displayName = "TextLinkListItem";
