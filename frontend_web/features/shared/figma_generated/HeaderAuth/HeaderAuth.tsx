"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { ChevronDown } from "../ChevronDown";

export type HeaderAuthState = "Logged Out" | "Logged In" | "Logged In - Hover";

export interface HeaderAuthProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: HeaderAuthState;
  avatarSrc?: string;
  avatarAlt?: string;
  onSignIn?: () => void;
  onRegister?: () => void;
  onAvatarClick?: () => void;
  className?: string;
}

export const HeaderAuth = forwardRef<HTMLDivElement, HeaderAuthProps>(
  (
    {
      state = "Logged Out",
      avatarSrc,
      avatarAlt = "User avatar",
      onSignIn,
      onRegister,
      onAvatarClick,
      className,
      ...props
    },
    ref,
  ) => {
    // Logged In state
    if (state === "Logged In") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center content-stretch",
            "gap-[var(--sds-size-space-200,8px)]",
            "px-[var(--sds-size-space-300,12px)]",
            "py-[var(--sds-size-space-200,8px)]",
            "rounded-[var(--sds-size-radius-200,8px)]",
            "cursor-pointer",
            className,
          )}
          onClick={onAvatarClick}
          {...props}
        >
          <Avatar
            type="image"
            size="large"
            shape="circle"
            src={avatarSrc}
            alt={avatarAlt}
            className="shrink-0"
          />
          <ChevronDown size="16" className="shrink-0" />
        </div>
      );
    }

    // Logged In - Hover state
    if (state === "Logged In - Hover") {
      return (
        <div
          ref={ref}
          className={cn(
            "bg-[var(--sds-color-background-default-default-hover,#f5f5f5)]",
            "flex items-center content-stretch",
            "gap-[var(--sds-size-space-200,8px)]",
            "px-[var(--sds-size-space-300,12px)]",
            "py-[var(--sds-size-space-200,8px)]",
            "rounded-[var(--sds-size-radius-200,8px)]",
            "cursor-pointer",
            className,
          )}
          onClick={onAvatarClick}
          {...props}
        >
          <Avatar
            type="image"
            size="large"
            shape="circle"
            src={avatarSrc}
            alt={avatarAlt}
            className="shrink-0"
          />
          <ChevronDown size="16" className="shrink-0" />
        </div>
      );
    }

    // Logged Out state (default)
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center content-stretch",
          "gap-[var(--sds-size-space-300,12px)]",
          "w-[178px]",
          className,
        )}
        {...props}
      >
        <div className="flex-1 basis-0 grow shrink-0 min-w-px min-h-px">
          <Button variant="neutral" size="medium" onClick={onSignIn}>
            Sign in
          </Button>
        </div>
        <div className="flex-1 basis-0 grow shrink-0 min-w-px min-h-px">
          <Button variant="primary" size="medium" onClick={onRegister}>
            Register
          </Button>
        </div>
      </div>
    );
  },
);

HeaderAuth.displayName = "HeaderAuth";
