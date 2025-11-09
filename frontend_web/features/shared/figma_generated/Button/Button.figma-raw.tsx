/**
 * ============================================
 * 🎨 Generated from Figma (RAW)
 * 📅 Generated at: 2025-11-09 18:00:00 JST
 * 🔗 Node ID: 4185-3778
 * 🔗 Figma URL: https://www.figma.com/design/WoOuJeIanK8Ke56zr6muug/Simple-Design-System--Community-?node-id=4185-3778
 * ============================================
 *
 * This is the RAW version from Figma MCP - DO NOT USE IN PRODUCTION
 * Use Button.tsx instead
 */
"use client";

import React from "react";

const img = "http://localhost:3845/assets/033754b7d4a00015b32c60053fe71f7a5a5f1aaf.svg";
const img1 = "http://localhost:3845/assets/9db6e888ea2ba937a92587b4d2255234922a17c7.svg";
const img2 = "http://localhost:3845/assets/af356927da1b4a35792e5a5a5112915ed7ba4164.svg";
const img3 = "http://localhost:3845/assets/bb4fa82a53c2e73d14c53cbd6490260cd5a5070f.svg";
const img4 = "http://localhost:3845/assets/84b6172ff4ac259f801f96b8f4f923b2664efe9b.svg";
const img5 = "http://localhost:3845/assets/7042bdc4186f626723e7be7f42c05a550b7f40b5.svg";

export interface ButtonProps {
  className?: string;
}

export default function Button({ className }: ButtonProps) {
  return (
    <div data-name="Button" data-node-id="4185:3778">
      <div
        className={`
          bg-[var(--sds-color-background-brand-default,#2c2c2c)]
          border-[var(--sds-color-border-brand-default,#2c2c2c)]
          border-[var(--sds-size-stroke-border,1px)]
          border-solid
          relative
          rounded-[var(--sds-size-radius-200,8px)]
          size-full
          ${className}
        `}
        data-name="Variant=Primary, State=Default, Size=Medium"
        data-node-id="4185:3779"
      >
        <div
          className={`
            box-border
            content-stretch
            flex
            gap-[var(--sds-size-space-200,8px)]
            items-center
            justify-center
            overflow-clip
            p-[var(--sds-size-space-300,12px)]
            relative
            rounded-[inherit]
            size-full
          `}
        >
          <div
            className={`
              overflow-clip
              relative
              shrink-0
              size-[16px]
            `}
            data-name="Star"
            data-node-id="4185:3780"
          >
            <div
              className={`
                absolute
                inset-[8.33%_8.33%_12.42%_8.33%]
              `}
              data-name="Icon"
              data-node-id="I4185:3780;68:16010"
            >
              <div
                className={`
                  absolute
                  inset-[-6.31%_-6%]
                `}
                style={{ "--stroke-0": "rgba(245, 245, 245, 1)" } as React.CSSProperties}
              >
                <img alt="" className="block max-w-none size-full" src={img} />
              </div>
            </div>
          </div>
          <p
            className={`
              font-[family-name:var(--sds-typography-body-font-family,'Inter:Regular',sans-serif)]
              font-[var(--sds-typography-body-font-weight-regular,400)]
              leading-none
              not-italic
              relative
              shrink-0
              text-[color:var(--sds-color-text-brand-on-brand,#f5f5f5)]
              text-[length:var(--sds-typography-body-size-medium,16px)]
              text-nowrap
              whitespace-pre
            `}
            data-node-id="4185:3781"
          >
            Button
          </p>
          <div
            className={`
              overflow-clip
              relative
              shrink-0
              size-[16px]
            `}
            data-name="X"
            data-node-id="4185:3782"
          >
            <div
              className={`
                absolute
                inset-1/4
              `}
              data-name="Icon"
              data-node-id="I4185:3782;68:16114"
            >
              <div
                className={`
                  absolute
                  inset-[-10%]
                `}
                style={{ "--stroke-0": "rgba(245, 245, 245, 1)" } as React.CSSProperties}
              >
                <img alt="" className="block max-w-none size-full" src={img1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
