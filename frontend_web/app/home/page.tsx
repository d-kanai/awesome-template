"use client";

import React from "react";
import { Header } from "@/features/shared/figma_generated/Header";
import { HeroActions } from "@/features/shared/figma_generated/HeroActions";
import { TestimonialCard } from "@/features/shared/figma_generated/TestimonialCard";
import { Footer } from "@/features/shared/figma_generated/Footer";
import { cn } from "@/features/shared/lib/utils";

// Sample testimonials data
const testimonials = [
  {
    quote: "This product has completely transformed how we work. Highly recommended!",
    title: "Sarah Johnson",
    description: "CEO, TechCorp",
    avatarSrc: "https://i.pravatar.cc/150?img=1",
  },
  {
    quote: "The best investment we've made for our business this year.",
    title: "Michael Chen",
    description: "Product Manager, StartupXYZ",
    avatarSrc: "https://i.pravatar.cc/150?img=2",
  },
  {
    quote: "Outstanding service and support. The team really cares about their customers.",
    title: "Emma Wilson",
    description: "Designer, Creative Agency",
    avatarSrc: "https://i.pravatar.cc/150?img=3",
  },
  {
    quote: "Simple, powerful, and intuitive. Everything we needed in one place.",
    title: "James Martinez",
    description: "CTO, Innovation Labs",
    avatarSrc: "https://i.pravatar.cc/150?img=4",
  },
  {
    quote: "The collaboration features have streamlined our entire design process.",
    title: "Lisa Anderson",
    description: "Design Lead, Digital Studios",
    avatarSrc: "https://i.pravatar.cc/150?img=5",
  },
  {
    quote: "Exceptional quality and attention to detail. Worth every penny.",
    title: "David Kim",
    description: "Founder, Creative Co",
    avatarSrc: "https://i.pravatar.cc/150?img=6",
  },
];

// Social link icons (simple SVG)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        onSignIn={() => console.log("Sign in clicked")}
        onRegister={() => console.log("Register clicked")}
      />

      {/* Hero Actions */}
      <HeroActions
        title="Welcome to Our Platform"
        subtitle="Experience innovation like never before"
        primaryButtonText="Get Started"
        secondaryButtonText="Learn More"
        onPrimaryButtonClick={() => console.log("Get Started clicked")}
        onSecondaryButtonClick={() => console.log("Learn More clicked")}
      />

      {/* Section - Placeholder Image */}
      <div className="relative w-full h-[400px] shrink-0">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute bg-[var(--sds-color-slate-200,#e3e3e3)] inset-0" />
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <p className="text-[length:var(--sds-typography-heading-size-base,24px)] text-[color:var(--sds-color-text-default-default,#1e1e1e)]">
              Image Placeholder
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section
        className={cn(
          "bg-[var(--sds-color-background-default-default,#ffffff)]",
          "flex flex-col items-start content-stretch",
          "gap-[var(--sds-size-space-1200,48px)]",
          "p-[var(--sds-size-space-1600,64px)]",
          "w-full",
        )}
      >
        {/* Section Header */}
        <div className="flex flex-col items-start content-stretch gap-[var(--sds-size-space-200,8px)]">
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
            What Our Customers Say
          </p>
          <div
            className={cn(
              "flex flex-col justify-center",
              "font-[family-name:var(--sds-typography-subheading-font-family,'Inter',sans-serif)]",
              "font-[var(--sds-typography-subheading-font-weight,400)]",
              "text-[length:var(--sds-typography-subheading-size-medium,20px)]",
              "leading-[0]",
              "text-[color:var(--sds-color-text-default-secondary,#757575)]",
              "w-full",
            )}
          >
            <p className="leading-[1.2]">Trusted by teams worldwide</p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div
          className={cn(
            "flex flex-wrap content-start items-start",
            "gap-[var(--sds-size-space-1200,48px)]",
            "w-full",
          )}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              title={testimonial.title}
              description={testimonial.description}
              avatarSrc={testimonial.avatarSrc}
              avatarAlt={testimonial.title}
              className="flex-1 basis-0 grow shrink-0 min-w-[300px] min-h-px"
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer
        socialLinks={[
          { icon: <TwitterIcon />, label: "Twitter" },
          { icon: <InstagramIcon />, label: "Instagram" },
          { icon: <YouTubeIcon />, label: "YouTube" },
          { icon: <LinkedInIcon />, label: "LinkedIn" },
        ]}
      />
    </div>
  );
}
