/**
 * ============================================
 * 🎨 Generated from Figma
 * 📅 Generated at: 2025-11-09 09:01:22 JST
 * 🔗 Node ID: 315:32700
 * ============================================
 *
 * Tooltip Component
 *
 * Features:
 * - 4 placements: Top, Bottom, Left, Right
 * - Semantic variables for dark mode
 * - Optional body text
 */

import React from "react";

const imgBeak = "http://localhost:3845/assets/d8c681b4413ff8cc735307ac2103f7eb0f5cef2c.svg";
const imgBeakStroke = "http://localhost:3845/assets/172428dca792563010f485b0a908ccfdaa526b45.svg";
const imgBeak1 = "http://localhost:3845/assets/92f687190d4627cb110133965b2bed582a4af8af.svg";
const imgBeakStroke1 = "http://localhost:3845/assets/9c9d864f77f49e4e73858c25be7747dbf8c9da0f.svg";
const imgBeak2 = "http://localhost:3845/assets/c9cfc604ea580f076bd531b27bfefb48ffafbe4e.svg";
const imgBeakStroke2 = "http://localhost:3845/assets/4290247453b518ba5827ec9cfb1fe1b6ae4bd6da.svg";

type TooltipProps = {
  title?: string;
  body?: string;
  hasBody?: boolean;
  placement?: "Top" | "Left" | "Right" | "Bottom";
  className?: string;
};

export default function Tooltip({
  title = "Title",
  body = "Body text",
  hasBody = true,
  placement = "Top",
  className = ""
}: TooltipProps) {
  const titleElement = (
    <p className="font-sans font-semibold leading-[1.4] not-italic relative shrink-0 text-base text-foreground text-center text-nowrap whitespace-pre" data-node-id="368:11411">
      {title}
    </p>
  );

  const bodyElement = hasBody && (
    <p className="font-sans font-normal leading-[1.4] not-italic relative shrink-0 text-sm text-foreground text-center text-nowrap whitespace-pre" data-node-id="368:11412">
      {body}
    </p>
  );

  // ベーススタイル（全placementで共通）
  const baseStyles = "bg-background border-border border border-solid box-border content-stretch flex flex-col gap-0 px-Space-300 py-Space-200 rounded-lg shadow-sm";

  if (placement === "Bottom") {
    return (
      <div className={`${baseStyles} items-center relative ${className}`} data-name="Placement=Bottom" data-node-id="315:32701">
        {/* Beak (矢印部分) - Top側 */}
        <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.7071067690849304)+(var(--transform-inner-height)*0.7071067690849304)))] items-center justify-center left-1/2 top-[-5.36px] translate-x-[-50%] w-[calc(1px*((var(--transform-inner-height)*0.7071067690849304)+(var(--transform-inner-width)*0.7071067690849304)))]" style={{ "--transform-inner-width": "8", "--transform-inner-height": "8" } as React.CSSProperties}>
          <div className="flex-none rotate-[315deg] scale-y-[-100%]">
            <div className="relative size-[8px]" data-name="Beak" data-node-id="352:6333">
              <div className="absolute inset-0">
                <img alt="" className="block max-w-none size-full" src={imgBeak} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.7071067690849304)+(var(--transform-inner-height)*0.7071067690849304)))] items-center justify-center left-1/2 top-[-5.36px] translate-x-[-50%] w-[calc(1px*((var(--transform-inner-height)*0.7071067690849304)+(var(--transform-inner-width)*0.7071067690849304)))]" style={{ "--transform-inner-width": "8", "--transform-inner-height": "8" } as React.CSSProperties}>
          <div className="flex-none rotate-[315deg] scale-y-[-100%]">
            <div className="relative size-[8px]" data-name="Beak (Stroke)" data-node-id="352:6332">
              <div className="absolute inset-0">
                <img alt="" className="block max-w-none size-full" src={imgBeakStroke} />
              </div>
            </div>
          </div>
        </div>
        {titleElement}
        {bodyElement}
      </div>
    );
  }

  if (placement === "Left") {
    return (
      <div className={`${baseStyles} items-start relative ${className}`} data-name="Placement=Left" data-node-id="315:32713">
        {/* Beak (矢印部分) - Right側 */}
        <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.7071067690849304)+(var(--transform-inner-height)*0.7071067690849304)))] items-center justify-center right-[-5.36px] top-1/2 translate-y-[-50%] w-[calc(1px*((var(--transform-inner-height)*0.7071067690849304)+(var(--transform-inner-width)*0.7071067690849304)))]" style={{ "--transform-inner-width": "8", "--transform-inner-height": "8" } as React.CSSProperties}>
          <div className="flex-none rotate-[45deg] scale-y-[-100%]">
            <div className="relative size-[8px]" data-name="Beak" data-node-id="352:6352">
              <div className="absolute inset-0">
                <img alt="" className="block max-w-none size-full" src={imgBeak1} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.7071067690849304)+(var(--transform-inner-height)*0.7071067690849304)))] items-center justify-center right-[-5.36px] top-1/2 translate-y-[-50%] w-[calc(1px*((var(--transform-inner-height)*0.7071067690849304)+(var(--transform-inner-width)*0.7071067690849304)))]" style={{ "--transform-inner-width": "8", "--transform-inner-height": "8" } as React.CSSProperties}>
          <div className="flex-none rotate-[45deg] scale-y-[-100%]">
            <div className="relative size-[8px]" data-name="Beak (Stroke)" data-node-id="352:6351">
              <div className="absolute inset-0">
                <img alt="" className="block max-w-none size-full" src={imgBeakStroke1} />
              </div>
            </div>
          </div>
        </div>
        {titleElement}
        {bodyElement}
      </div>
    );
  }

  if (placement === "Right") {
    return (
      <div className={`${baseStyles} items-start relative ${className}`} data-name="Placement=Right" data-node-id="315:32710">
        {/* Beak (矢印部分) - Left側 */}
        <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.7071067690849304)+(var(--transform-inner-height)*0.7071067690849304)))] items-center justify-center left-[-5.36px] top-1/2 translate-y-[-50%] w-[calc(1px*((var(--transform-inner-height)*0.7071067690849304)+(var(--transform-inner-width)*0.7071067690849304)))]" style={{ "--transform-inner-width": "8", "--transform-inner-height": "8" } as React.CSSProperties}>
          <div className="flex-none rotate-[135deg]">
            <div className="relative size-[8px]" data-name="Beak" data-node-id="352:6371">
              <div className="absolute inset-0">
                <img alt="" className="block max-w-none size-full" src={imgBeak2} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.7071067690849304)+(var(--transform-inner-height)*0.7071067690849304)))] items-center justify-center left-[-5.36px] top-1/2 translate-y-[-50%] w-[calc(1px*((var(--transform-inner-height)*0.7071067690849304)+(var(--transform-inner-width)*0.7071067690849304)))]" style={{ "--transform-inner-width": "8", "--transform-inner-height": "8" } as React.CSSProperties}>
          <div className="flex-none rotate-[135deg]">
            <div className="relative size-[8px]" data-name="Beak (Stroke)" data-node-id="352:6370">
              <div className="absolute inset-0">
                <img alt="" className="block max-w-none size-full" src={imgBeakStroke2} />
              </div>
            </div>
          </div>
        </div>
        {titleElement}
        {bodyElement}
      </div>
    );
  }

  // Default: Top
  return (
    <div className={`${baseStyles} items-center relative ${className}`} data-name="Placement=Top" data-node-id="280:23461">
      {/* Beak (矢印部分) - Bottom側 */}
      <div className="absolute bottom-[-5.36px] flex h-[calc(1px*((var(--transform-inner-width)*0.7071067690849304)+(var(--transform-inner-height)*0.7071067690849304)))] items-center justify-center left-1/2 translate-x-[-50%] w-[calc(1px*((var(--transform-inner-height)*0.7071067690849304)+(var(--transform-inner-width)*0.7071067690849304)))]" style={{ "--transform-inner-width": "8", "--transform-inner-height": "8" } as React.CSSProperties}>
        <div className="flex-none rotate-[45deg]">
          <div className="relative size-[8px]" data-name="Beak" data-node-id="352:6314">
            <div className="absolute inset-0">
              <img alt="" className="block max-w-none size-full" src={imgBeak1} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[-5.36px] flex h-[calc(1px*((var(--transform-inner-width)*0.7071067690849304)+(var(--transform-inner-height)*0.7071067690849304)))] items-center justify-center left-1/2 translate-x-[-50%] w-[calc(1px*((var(--transform-inner-height)*0.7071067690849304)+(var(--transform-inner-width)*0.7071067690849304)))]" style={{ "--transform-inner-width": "8", "--transform-inner-height": "8" } as React.CSSProperties}>
        <div className="flex-none rotate-[45deg]">
          <div className="relative size-[8px]" data-name="Beak (Stroke)" data-node-id="352:6313">
            <div className="absolute inset-0">
              <img alt="" className="block max-w-none size-full" src={imgBeakStroke1} />
            </div>
          </div>
        </div>
      </div>
      {titleElement}
      {bodyElement}
    </div>
  );
}
