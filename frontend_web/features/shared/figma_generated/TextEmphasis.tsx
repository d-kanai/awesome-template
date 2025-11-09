/**
 * Text Emphasis Component - Figmaから自動生成
 *
 * Generated from Figma
 * Node ID: 2087:8485
 *
 * Typography: Body Emphasis (16px, Italic, Inter)
 * セマンティック変数を使用してダークモード対応
 */

import React from "react";

type TextEmphasisProps = {
  text?: string;
  className?: string;
};

export default function TextEmphasis({
  text = "Text Emphasis",
  className = ""
}: TextEmphasisProps) {
  return (
    <div className={`content-stretch flex items-start ${className}`} data-name="Text Emphasis" data-node-id="2087:8485">
      <p className="font-sans font-normal italic leading-[1.4] relative shrink-0 text-foreground text-base text-nowrap whitespace-pre" data-node-id="2087:8467">
        {text}
      </p>
    </div>
  );
}
