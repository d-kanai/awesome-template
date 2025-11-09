"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../Button";

export type ButtonGroupAlign = "Justify" | "Start" | "End" | "Center" | "Stack";

export interface ButtonGroupButton {
  label: string;
  variant?: "primary" | "neutral";
  onClick?: () => void;
}

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: ButtonGroupAlign;
  size?: "small" | "medium" | "large";
  startButton?: ButtonGroupButton;
  endButton?: ButtonGroupButton;
  className?: string;
}

const defaultStartButton: ButtonGroupButton = {
  label: "Button",
  variant: "neutral",
};

const defaultEndButton: ButtonGroupButton = {
  label: "Button",
  variant: "primary",
};

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      align = "Justify",
      size = "medium",
      startButton = defaultStartButton,
      endButton = defaultEndButton,
      className,
      ...props
    },
    ref,
  ) => {
    // Stack (vertical) layout
    if (align === "Stack") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-col items-start justify-center content-stretch",
            "gap-[var(--sds-size-space-400,16px)]",
            "w-[240px]",
            className,
          )}
          {...props}
        >
          {startButton && (
            <Button
              variant={startButton.variant || "neutral"}
              size={size}
              onClick={startButton.onClick}
              className="w-full"
            >
              {startButton.label}
            </Button>
          )}
          {endButton && (
            <Button
              variant={endButton.variant || "primary"}
              size={size}
              onClick={endButton.onClick}
              className="w-full"
            >
              {endButton.label}
            </Button>
          )}
        </div>
      );
    }

    // Horizontal layouts
    const justifyClass = {
      Justify: "",
      Start: "",
      End: "justify-end",
      Center: "justify-center",
    }[align];

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center content-stretch",
          "gap-[var(--sds-size-space-400,16px)]",
          "w-[240px]",
          justifyClass,
          className,
        )}
        {...props}
      >
        {startButton && (
          <Button
            variant={startButton.variant || "neutral"}
            size={size}
            onClick={startButton.onClick}
            className={cn(
              align === "Justify" && "flex-1 basis-0 grow shrink-0 min-w-px min-h-px",
              align !== "Justify" && "shrink-0",
            )}
          >
            {startButton.label}
          </Button>
        )}
        {endButton && (
          <Button
            variant={endButton.variant || "primary"}
            size={size}
            onClick={endButton.onClick}
            className={cn(
              align === "Justify" && "flex-1 basis-0 grow shrink-0 min-w-px min-h-px",
              align !== "Justify" && "shrink-0",
            )}
          >
            {endButton.label}
          </Button>
        )}
      </div>
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";
