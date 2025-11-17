/**
 * ============================================
 * 🎨 CardGridTestimonials
 * 📅 Synced at: 2025-11-09 19:00 JST
 * 🔗 Figma Raw: features/shared/ui/figma_generated/components/CardGridTestimonials/CardGridTestimonials.figma-raw.tsx
 * ============================================
 */
"use client";

import React, { forwardRef } from "react";
import { cn } from "@/features/shared/lib/utils";
import { TestimonialCard } from "../TestimonialCard";
import { TextContentHeading } from "../TextContentHeading";

export interface Testimonial {
  quote: string;
  title: string;
  description: string;
  avatarSrc?: string;
  avatarAlt?: string;
}

export interface CardGridTestimonialsProps
  extends React.HTMLAttributes<HTMLElement> {
  heading?: string;
  subheading?: string;
  hasSubheading?: boolean;
  testimonials?: Testimonial[];
  className?: string;
}

export const CardGridTestimonials = forwardRef<
  HTMLElement,
  CardGridTestimonialsProps
>(
  (
    {
      heading = "What Our Customers Say",
      subheading = "Trusted by teams worldwide",
      hasSubheading = true,
      testimonials = [],
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "flex flex-col content-stretch items-start",
          "gap-[var(--sds-size-space-1200,48px)]",
          "bg-[color:var(--sds-color-background-default-default,#ffffff)]",
          "w-full",

          // Mobile (デフォルト): 小さなpadding
          "px-[var(--sds-size-space-600,24px)]",
          "py-[var(--sds-size-space-600,24px)]",

          // Desktop (md: 768px以上): 大きなpadding
          "md:px-[var(--sds-size-space-1600,64px)]",
          "md:py-[var(--sds-size-space-1600,64px)]",
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
          className={cn(
            "w-full",
            // Desktop: 1200pxに制限
            "md:w-[1200px]",
          )}
        />

        {/* Testimonial Cards Grid */}
        <div
          className={cn(
            "w-full",

            // Mobile (デフォルト): 縦並び、小さなgap
            "flex flex-col",
            "gap-[var(--sds-size-space-600,24px)]",

            // Desktop (md: 768px以上): 3列グリッド、大きなgap、1200pxに制限
            "md:w-[1200px]",
            "md:grid md:grid-cols-3",
            "md:gap-[var(--sds-size-space-1200,48px)]",
          )}
        >
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={`${testimonial.title}-${testimonial.quote}`}
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
