"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { Avatar } from "../Avatar";

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
      <p
        className={cn(
          "font-[family-name:var(--sds-typography-heading-font-family,'Inter',sans-serif)]",
          "font-[var(--sds-typography-heading-font-weight,600)]",
          "text-[length:var(--sds-typography-heading-size-base,24px)]",
          "leading-[1.2]",
          "tracking-[-0.48px]",
          "text-[color:var(--sds-color-text-default-default,#1e1e1e)]",
          "w-full",
        )}
      >
        {quote}
      </p>

      {/* Avatar Block */}
      <div className="flex gap-[var(--sds-size-space-300,12px)] items-center w-full">
        {/* Avatar */}
        <Avatar
          type="image"
          size="large"
          shape="circle"
          src={avatarSrc}
          alt={avatarAlt}
        />

        {/* Info */}
        <div className="flex flex-col gap-[var(--sds-size-space-050,2px)] items-start flex-1">
          {/* Title */}
          <p
            className={cn(
              "font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)]",
              "font-[var(--sds-typography-body-font-weight-strong,600)]",
              "text-[length:var(--sds-typography-body-size-medium,16px)]",
              "leading-[1.4]",
              "text-[color:var(--sds-color-text-default-default,#1e1e1e)]",
              "w-full",
            )}
          >
            {title}
          </p>

          {/* Description */}
          <p
            className={cn(
              "font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)]",
              "font-[var(--sds-typography-body-font-weight-regular,400)]",
              "text-[length:var(--sds-typography-body-size-small,14px)]",
              "leading-[1.4]",
              "text-[color:var(--sds-color-text-default-secondary,#757575)]",
              "w-full",
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
