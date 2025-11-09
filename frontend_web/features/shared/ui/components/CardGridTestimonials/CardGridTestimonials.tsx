/**
 * ============================================
 * 🎨 Generated from Figma
 * 📅 Generated at: 2025-11-09 15:30:00 JST
 * 🔗 Node ID: 348-13347
 * 🔗 Figma URL: https://www.figma.com/design/WoOuJeIanK8Ke56zr6muug/Simple-Design-System--Community-?node-id=348-13347
 * ============================================
 */
"use client";

import React, { forwardRef } from "react";
import { cn } from "@/features/shared/lib/utils";
import { TextContentHeading } from "../TextContentHeading";
import { TestimonialCard } from "../TestimonialCard";

export type CardGridTestimonialsPlatform = "Desktop" | "Mobile";

export interface Testimonial {
  quote: string;
  title: string;
  description: string;
  avatarSrc?: string;
  avatarAlt?: string;
}

export interface CardGridTestimonialsProps extends React.HTMLAttributes<HTMLElement> {
  platform?: CardGridTestimonialsPlatform;
  heading?: string;
  subheading?: string;
  hasSubheading?: boolean;
  testimonials?: Testimonial[];
  className?: string;
}

export const CardGridTestimonials = forwardRef<HTMLElement, CardGridTestimonialsProps>(
  (
    {
      platform = "Desktop",
      heading = "What Our Customers Say",
      subheading = "Trusted by teams worldwide",
      hasSubheading = true,
      testimonials = [],
      className,
      ...props
    },
    ref,
  ) => {
    // Platform-specific layout classes
    const containerClasses = {
      Desktop: cn(
        "w-[1200px]",
        "px-[var(--sds-size-space-1600,64px)]",
        "py-[var(--sds-size-space-1600,64px)]",
      ),
      Mobile: cn(
        "w-[375px]",
        "px-[var(--sds-size-space-600,24px)]",
        "py-[var(--sds-size-space-600,24px)]",
      ),
    }[platform];

    const gridClasses = {
      Desktop: cn(
        "grid grid-cols-3",
        "gap-[var(--sds-size-space-1200,48px)]",
      ),
      Mobile: cn(
        "flex flex-col",
        "gap-[var(--sds-size-space-600,24px)]",
      ),
    }[platform];

    return (
      <section
        ref={ref}
        className={cn(
          "flex flex-col items-center content-stretch",
          "gap-[var(--sds-size-space-1200,48px)]",
          "bg-[color:var(--sds-color-background-default-default,#ffffff)]",
          containerClasses,
          className,
        )}
        {...props}
      >
        {/* Text Content Heading */}
        <TextContentHeading
          heading={heading}
          subheading={subheading}
          hasSubheading={hasSubheading}
          align="Start"
          className="w-full"
        />

        {/* Testimonial Cards Grid */}
        <div className={cn("w-full", gridClasses)}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              title={testimonial.title}
              description={testimonial.description}
              avatarSrc={testimonial.avatarSrc}
              avatarAlt={testimonial.avatarAlt}
            />
          ))}
        </div>
      </section>
    );
  },
);

CardGridTestimonials.displayName = "CardGridTestimonials";
