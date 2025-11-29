/**
 * ============================================
 * 🎨 Generated from Figma (RAW)
 * 📅 Generated at: 2025-11-09 15:30:00 JST
 * 🔗 Node ID: 2153-7973
 * 🔗 Figma URL: https://www.figma.com/design/WoOuJeIanK8Ke56zr6muug/Simple-Design-System--Community-?node-id=2153-7973
 * ============================================
 *
 * This is the RAW version from Figma MCP - DO NOT USE IN PRODUCTION
 * Use TextLinkListItem.tsx instead
 */
"use client";

export interface TextLinkListItemProps {
  text?: string;
  className?: string;
}

export default function TextLinkListItem({
  text = "List item",
  className,
}: TextLinkListItemProps) {
  return (
    <div className="h-[22px] w-[89px]">
      <div
        className={`
          absolute
          bottom-0
          left-0
          right-[26.97%]
          top-0
          flex
          flex-col
          justify-center
          not-italic
          leading-[0]
          font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)]
          font-[var(--sds-typography-body-font-weight-regular,400)]
          text-[length:var(--sds-typography-body-size-medium,16px)]
          text-[color:var(--sds-color-text-default-default,#1e1e1e)]
          text-nowrap
          ${className}
        `}
      >
        <p className="leading-[1.4] whitespace-pre">{text}</p>
      </div>
    </div>
  );
}
