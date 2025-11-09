import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/lib/classNames";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { NavigationPillList } from "./NavigationPillList";

/**
 * Header コンポーネント
 *
 * ページ上部のナビゲーションヘッダー
 * Auto Layout情報から自動生成
 *
 * @figma 2287:22651
 * @generated Figma REST API + Auto Layout
 */

export interface HeaderProps
  extends ComponentPropsWithoutRef<"header">,
    VariantProps<typeof headerVariants> {
  platform?: "desktop" | "mobile";
  state?: "default" | "open";
}

const headerVariants = cva(
  "flex flex-row gap-Space-600 items-center p-Space-800 bg-background border-b border-border",
  {
    variants: {
      platform: {
        desktop: "h-[99px]",
        mobile: "h-[84px]",
      },
      state: {
        default: "",
        open: "",
      },
    },
    defaultVariants: {
      platform: "desktop",
      state: "default",
    },
  },
);

export const Header = forwardRef<HTMLElement, HeaderProps>(
  function Header(
    {
      className,
      platform = "desktop",
      state = "default",
      ...props
    },
    ref,
  ) {
    return (
      <header
        ref={ref}
        className={cn(headerVariants({ platform, state, className }))}
        {...props}
      >
        {/* Logo/Brand Section */}
        <div className="flex flex-row gap-Space-600 items-center">
          {platform === "mobile" && (
            <IconButton
              variant="neutral"
              size="medium"
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h14M3 10h14M3 14h14" />
                </svg>
              }
              aria-label="Menu"
            />
          )}
          <div className="w-10 h-[35px] bg-primary" aria-label="Logo">
            {/* Placeholder for logo */}
          </div>
        </div>

        {/* Navigation Section - Desktop only */}
        {platform === "desktop" && (
          <NavigationPillList
            className="flex flex-row gap-Space-200 justify-end"
            items={[
              { label: "Products", href: "#", active: true },
              { label: "Solutions", href: "/auth/signup" },
              { label: "Community", href: "#" },
              { label: "Resources", href: "#" },
              { label: "Pricing", href: "#" },
              { label: "Contact", href: "#" },
              { label: "Link", href: "#" },
            ]}
          />
        )}

        {/* Auth Buttons Section */}
        <div className="flex flex-row gap-Space-300 items-center">
          <Button variant="neutral" size="small">
            Sign in
          </Button>
          <Button variant="primary" size="small">
            Register
          </Button>
        </div>
      </header>
    );
  },
);
