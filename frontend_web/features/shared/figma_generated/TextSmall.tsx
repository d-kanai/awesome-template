/**
 * Text Small Component - Figmaから自動生成
 *
 * Generated from Figma
 * Node ID: 2087:8484
 *
 * Typography: Body Small (14px, Regular, Inter)
 * セマンティック変数を使用してダークモード対応
 */

import React from "react";

type TextSmallProps = {
  text?: string;
  className?: string;
};

export default function TextSmall({
  text = "Text Small",
  className = ""
}: TextSmallProps) {
  return (
    <div className={`content-stretch flex items-start ${className}`} data-name="Text Small" data-node-id="2087:8484">
      <p className="font-sans font-normal leading-[1.4] not-italic relative shrink-0 text-foreground text-sm text-nowrap whitespace-pre" data-node-id="2087:8470">
        {text}
      </p>
    </div>
  );
}
