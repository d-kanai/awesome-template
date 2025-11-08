import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/lib/classNames";

export interface IconButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children">,
    VariantProps<typeof iconButtonVariants> {
  icon: ReactNode;
}

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-ring",
        subtle: "bg-secondary text-secondary-foreground hover:bg-secondary-hover focus-visible:ring-ring",
        neutral: "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
      },
      size: {
        small: "h-8 w-8 text-sm",
        medium: "h-10 w-10",
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

export function IconButton({
  className,
  variant,
  size,
  state,
  icon,
  disabled,
  ...props
}: IconButtonProps) {
  const isDisabled = disabled || state === "disabled";

  return (
    <button
      className={cn(iconButtonVariants({ variant, size, state, className }))}
      disabled={isDisabled}
      {...props}
    >
      {icon}
    </button>
  );
}
