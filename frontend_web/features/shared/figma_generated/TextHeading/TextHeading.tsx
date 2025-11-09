/**
 * Text Heading Component - Figmaから自動生成
 *
 * Generated from Figma
 * Node ID: 2087:8488
 *
 * Typography: Heading (24px, Semi Bold, Inter)
 * セマンティック変数を使用してダークモード対応
 */

import React from "react";

type TextHeadingProps = {
  text?: string;
  className?: string;
};

export default function TextHeading({
  text = "Text Heading",
  className = ""
}: TextHeadingProps) {
  return (
    <div className={`content-stretch flex items-start ${className}`} data-name="Text Heading" data-node-id="2087:8488">
      <p className="font-sans font-semibold leading-[1.2] not-italic relative shrink-0 text-foreground text-2xl text-nowrap tracking-tight whitespace-pre" data-node-id="2087:8466">
        {text}
      </p>
    </div>
  );
}
