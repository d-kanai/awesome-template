/**
 * Text Title Page Component - Figmaから自動生成
 *
 * Generated from Figma
 * Node ID: 2087:8490
 *
 * Typography: Title Page (48px, Bold, Inter)
 * セマンティック変数を使用してダークモード対応
 */

import React from "react";

type TextTitlePageProps = {
  text?: string;
  className?: string;
};

export default function TextTitlePage({
  text = "Text Title Page",
  className = ""
}: TextTitlePageProps) {
  return (
    <div className={`content-stretch flex items-start ${className}`} data-name="Text Title Page" data-node-id="2087:8490">
      <p className="font-sans font-bold leading-[1.2] not-italic relative shrink-0 text-foreground text-5xl text-nowrap tracking-tight whitespace-pre" data-node-id="2087:8464">
        {text}
      </p>
    </div>
  );
}
