/**
 * Text Strong Component - Figmaから自動生成
 *
 * Generated from Figma
 * Node ID: 2087:8486
 *
 * Typography: Body Strong (16px, Semi Bold, Inter)
 * セマンティック変数を使用してダークモード対応
 */

import React from "react";

type TextStrongProps = {
  text?: string;
  className?: string;
};

export default function TextStrong({
  text = "Text Strong",
  className = ""
}: TextStrongProps) {
  return (
    <div className={`content-stretch flex items-start ${className}`} data-name="Text Strong" data-node-id="2087:8486">
      <p className="font-sans font-semibold leading-[1.4] not-italic relative shrink-0 text-foreground text-base text-nowrap whitespace-pre" data-node-id="2087:8468">
        {text}
      </p>
    </div>
  );
}
