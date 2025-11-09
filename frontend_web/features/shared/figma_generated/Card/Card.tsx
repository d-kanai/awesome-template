"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../Button";

export type CardAssetType = "icon" | "image";
export type CardVariant = "default" | "stroke";
export type CardDirection = "horizontal" | "vertical";

export interface CardProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  assetType?: CardAssetType;
  variant?: CardVariant;
  direction?: CardDirection;
  icon?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  className?: string;
}

export function Card({
  title,
  description,
  buttonText = "Button",
  onButtonClick,
  assetType = "icon",
  variant = "default",
  direction = "horizontal",
  icon,
  image,
  imageAlt = "",
  className,
}: CardProps) {
  const isHorizontal = direction === "horizontal";
  const hasStroke = variant === "stroke";

  return (
    <div
      className={cn(
        "flex items-start",
        "gap-[var(--sds-size-space-600,24px)]",
        isHorizontal ? "flex-row flex-wrap" : "flex-col",
        hasStroke && [
          "bg-[var(--sds-color-background-default-default,#ffffff)]",
          "border-[color:var(--sds-color-border-default-default,#d9d9d9)]",
          "border-solid",
          "border-[length:var(--sds-size-stroke-border,1px)]",
          "p-[var(--sds-size-space-600,24px)]",
          "rounded-[var(--sds-size-radius-200,8px)]",
        ],
        className,
      )}
    >
      {/* Asset (Icon or Image) */}
      {assetType === "icon" && icon && (
        <div className="shrink-0 size-[32px]">{icon}</div>
      )}
      {assetType === "image" && (
        <div className="relative shrink-0 size-[160px] min-w-[160px]">
          {image ? (
            <img
              src={image}
              alt={imageAlt}
              className="size-full object-cover rounded-[var(--sds-size-radius-200,8px)]"
            />
          ) : (
            <div
              className="size-full bg-[var(--sds-color-slate-200,#e3e3e3)] rounded-[var(--sds-size-radius-200,8px)]"
              aria-label="Image placeholder"
            />
          )}
        </div>
      )}

      {/* Body */}
      <div
        className={cn(
          "flex flex-col gap-[var(--sds-size-space-400,16px)] items-start",
          "min-w-[160px]",
          isHorizontal ? "flex-1 min-h-0" : "w-full",
        )}
      >
        {/* Text */}
        <div className="flex flex-col gap-[var(--sds-size-space-200,8px)] items-start w-full">
          <h3
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
            {title}
          </h3>
          <p
            className={cn(
              "font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)]",
              "font-[var(--sds-typography-body-font-weight-regular,400)]",
              "text-[length:var(--sds-typography-body-size-medium,16px)]",
              "leading-[1.4]",
              "text-[color:var(--sds-color-text-default-secondary,#757575)]",
              "w-full",
            )}
          >
            {description}
          </p>
        </div>

        {/* Button Group */}
        {buttonText && (
          <div className="flex gap-[var(--sds-size-space-400,16px)] items-center w-full">
            <Button variant="neutral" size="medium" onClick={onButtonClick}>
              {buttonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
