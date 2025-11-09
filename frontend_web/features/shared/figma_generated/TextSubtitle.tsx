/**
 * Text Subtitle Component - Figmaから自動生成
 *
 * Generated from Figma
 * Node ID: 2103:22298
 *
 * Typography: Subtitle (32px, Regular, Inter)
 * セマンティック変数を使用してダークモード対応
 */

import React from "react";

type TextSubtitleProps = {
  text?: string;
  className?: string;
};

export default function TextSubtitle({
  text = "Text Subtitle",
  className = ""
}: TextSubtitleProps) {
  return (
    <div className={`content-stretch flex items-start ${className}`} data-name="Text Subtitle" data-node-id="2103:22298">
      <p className="font-sans font-normal leading-[1.2] not-italic relative shrink-0 text-foreground text-3xl text-nowrap whitespace-pre" data-node-id="2103:22297">
        {text}
      </p>
    </div>
  );
}
