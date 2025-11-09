/**
 * Text Component - Figmaから自動生成
 *
 * Generated from Figma
 * Node ID: 2087:8487
 *
 * Typography: Body Base (16px, Regular, Inter)
 * セマンティック変数を使用してダークモード対応
 */

import React from "react";

type TextProps = {
  text?: string;
  className?: string;
};

export default function Text({
  text = "Text",
  className = ""
}: TextProps) {
  return (
    <div className={`content-stretch flex items-start ${className}`} data-name="Text" data-node-id="2087:8487">
      <p className="font-sans font-normal leading-[1.4] not-italic relative text-foreground text-base break-words" data-node-id="2087:8469">
        {text}
      </p>
    </div>
  );
}
