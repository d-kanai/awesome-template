"use client";

import React from "react";
import { cn } from "../../lib/utils";

export interface FooterLinkItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface FooterLinkSection {
  title: string;
  links: FooterLinkItem[];
}

export interface SocialLink {
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  label: string;
}

export interface FooterProps {
  logoSrc?: string;
  logoAlt?: string;
  socialLinks?: SocialLink[];
  linkSections?: FooterLinkSection[];
  className?: string;
}

const defaultLinkSections: FooterLinkSection[] = [
  {
    title: "Use cases",
    links: [
      { label: "UI design" },
      { label: "UX design" },
      { label: "Wireframing" },
      { label: "Diagramming" },
      { label: "Brainstorming" },
      { label: "Online whiteboard" },
      { label: "Team collaboration" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Design" },
      { label: "Prototyping" },
      { label: "Development features" },
      { label: "Design systems" },
      { label: "Collaboration features" },
      { label: "Design process" },
      { label: "FigJam" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog" },
      { label: "Best practices" },
      { label: "Colors" },
      { label: "Color wheel" },
      { label: "Support" },
      { label: "Developers" },
      { label: "Resource library" },
    ],
  },
];

export function Footer({
  logoSrc,
  logoAlt = "Logo",
  socialLinks = [],
  linkSections = defaultLinkSections,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "bg-[var(--sds-color-background-default-default,#ffffff)]",
        "border-solid",
        "border-[length:var(--sds-size-stroke-border,1px)]",
        "border-[color:var(--sds-color-border-default-default,#d9d9d9)]",
        "border-t border-l-0 border-r-0 border-b-0",
        "w-full",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-wrap content-start items-start",
          "gap-[var(--sds-size-space-400,16px)]",
          "overflow-clip",
          "px-[var(--sds-size-space-800,32px)]",
          "pt-[var(--sds-size-space-800,32px)]",
          "pb-[var(--sds-size-space-4000,160px)]",
        )}
      >
        {/* Logo and Social Links */}
        <div className="flex flex-col items-start content-stretch gap-[var(--sds-size-space-600,24px)] shrink-0 min-w-[240px] w-[262px]">
          {/* Logo */}
          {logoSrc ? (
            <div className="relative w-[23.333px] h-[35px] shrink-0">
              <img
                src={logoSrc}
                alt={logoAlt}
                className="block max-w-none size-full"
              />
            </div>
          ) : (
            <div className="relative w-[23.333px] h-[35px] bg-[var(--sds-color-background-brand-default,#2c2c2c)] rounded-[var(--sds-size-radius-100,4px)]" />
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center content-stretch gap-[var(--sds-size-space-400,16px)]">
              {socialLinks.map((social, index) => (
                <button
                  key={index}
                  onClick={social.onClick}
                  aria-label={social.label}
                  className="relative shrink-0 size-[24px]"
                >
                  {social.icon}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Link Sections */}
        {linkSections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="flex flex-col items-start content-stretch gap-[var(--sds-size-space-300,12px)] shrink-0 w-[262px]"
          >
            {/* Section Title */}
            <div className="flex flex-col items-start content-stretch gap-[10px] pb-[var(--sds-size-space-400,16px)] pt-0 px-0 w-full">
              <div className="flex items-start content-stretch w-full">
                <p
                  className={cn(
                    "font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)]",
                    "font-[var(--sds-typography-body-font-weight-strong,600)]",
                    "text-[length:var(--sds-typography-body-size-medium,16px)]",
                    "leading-[1.4]",
                    "text-[color:var(--sds-color-text-default-default,#1e1e1e)]",
                    "text-nowrap whitespace-pre",
                  )}
                >
                  {section.title}
                </p>
              </div>
            </div>

            {/* Links */}
            {section.links.map((link, linkIndex) => (
              <div key={linkIndex} className="relative h-[22px] w-[89px]">
                <button
                  onClick={link.onClick}
                  className={cn(
                    "absolute bottom-0 left-0 right-[26.97%] top-0",
                    "flex flex-col justify-center",
                    "font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)]",
                    "font-[var(--sds-typography-body-font-weight-regular,400)]",
                    "text-[length:var(--sds-typography-body-size-medium,16px)]",
                    "leading-[0]",
                    "text-[color:var(--sds-color-text-default-default,#1e1e1e)]",
                    "text-nowrap",
                  )}
                >
                  <p className="leading-[1.4] whitespace-pre">{link.label}</p>
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
