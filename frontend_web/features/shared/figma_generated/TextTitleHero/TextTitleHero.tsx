/**
 * ============================================
 * 🎨 Generated from Figma
 * 📅 Generated at: 2025-11-09 09:01:22 JST
 * 🔗 Node ID: 2087:8491
 * ============================================
 *
 * Text Title Hero Component
 *
 * Typography: Title Hero (72px, Bold, Inter)
 * Semantic variables for dark mode support
 */

import React from "react";

type TextTitleHeroProps = {
  text?: string;
  className?: string;
};

export default function TextTitleHero({
  text = "Text Title Hero",
  className = ""
}: TextTitleHeroProps) {
  return (
    <div className={`content-stretch flex items-start ${className}`} data-name="Text Title Hero" data-node-id="2087:8491">
      <p className="font-sans font-bold leading-[1.2] not-italic relative shrink-0 text-foreground text-7xl text-nowrap tracking-tight whitespace-pre" data-node-id="2087:8463">
        {text}
      </p>
    </div>
  );
}
