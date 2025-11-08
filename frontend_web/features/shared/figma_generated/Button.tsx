import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/lib/classNames";

export interface ButtonProps
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  label?: string;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  hasIconStart?: boolean;
  hasIconEnd?: boolean;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-body-small-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-ring",
        subtle: "bg-secondary text-secondary-foreground hover:bg-secondary-hover focus-visible:ring-ring",
        neutral: "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
      },
      size: {
        small: "h-9 px-Space-300 text-body-small",
        medium: "h-10 px-Space-400 py-Space-200",
      },
      state: {
        default: "",
        hover: "",
        disabled: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
      state: "default",
    },
  },
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant,
      size,
      state,
      disabled,
      label,
      iconStart,
      iconEnd,
      hasIconStart,
      hasIconEnd,
      children,
      ...props
    },
    ref,
  ) {
    const isDisabled = disabled || state === "disabled";
    const content = label || children;
    const showIconStart = iconStart || hasIconStart;
    const showIconEnd = iconEnd || hasIconEnd;

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, state, className }))}
        disabled={isDisabled}
        {...props}
      >
        {showIconStart && <span className="mr-Space-150" aria-hidden="true">{iconStart}</span>}
        {content}
        {showIconEnd && <span className="ml-Space-150" aria-hidden="true">{iconEnd}</span>}
      </button>
    );
  },
)
