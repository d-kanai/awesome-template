/**
 * Text Subheading Component - Figmaから自動生成
 *
 * Generated from Figma
 * Node ID: 2103:22303
 *
 * Typography: Subheading (20px, Regular, Inter)
 * セマンティック変数を使用してダークモード対応
 */

import React from "react";

type TextSubheadingProps = {
  text?: string;
  className?: string;
};

export default function TextSubheading({
  text = "Text Subheading",
  className = ""
}: TextSubheadingProps) {
  return (
    <div className={`content-stretch flex items-start ${className}`} data-name="Text Subheading" data-node-id="2103:22303">
      <p className="font-sans font-normal leading-[1.2] not-italic relative shrink-0 text-foreground text-xl text-nowrap whitespace-pre" data-node-id="2103:22302">
        {text}
      </p>
    </div>
  );
}
