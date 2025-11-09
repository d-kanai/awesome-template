/**
 * ============================================
 * 🎨 Generated from Figma
 * 📅 Synced at: 2025-11-09 15:30:00 JST
 * 🔗 Node ID: 348-13348
 * 🔗 Figma URL: https://www.figma.com/design/WoOuJeIanK8Ke56zr6muug/Simple-Design-System--Community-?node-id=348-13348
 * ============================================
 */
"use client";

import { cn } from "@/features/shared/lib/utils";
// biome-ignore lint/correctness/noUnusedImports: React is needed for JSX in Storybook
import React from "react";
import { AvatarBlock } from "../AvatarBlock";
import { TextContentHeading } from "../TextContentHeading";

export interface TestimonialCardProps {
  quote: string;
  title: string;
  description: string;
  avatarSrc?: string;
  avatarAlt?: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  title,
  description,
  avatarSrc,
  avatarAlt = "",
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start",
        "gap-[var(--sds-size-space-600,24px)]",
        "bg-[var(--sds-color-background-default-default,#ffffff)]",
        "border-solid",
        "border-[length:var(--sds-size-stroke-border,1px)]",
        "border-[color:var(--sds-color-border-default-default,#d9d9d9)]",
        "p-[var(--sds-size-space-600,24px)]",
        "rounded-[var(--sds-size-radius-200,8px)]",
        "min-w-[240px]",
        className,
      )}
    >
      {/* Quote */}
      <TextContentHeading
        heading={quote}
        hasSubheading={false}
        align="Start"
        className="w-full"
      />

      {/* Avatar Block */}
      <AvatarBlock
        title={title}
        description={description}
        avatarSrc={avatarSrc}
        avatarAlt={avatarAlt}
        avatarSize="large"
        avatarShape="circle"
        className="w-full"
      />
    </div>
  );
}
