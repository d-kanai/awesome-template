/**
 * Text Code Component - Figmaから自動生成
 *
 * Generated from Figma
 * Node ID: 2104:22325
 *
 * Typography: Body Code (16px, Regular, Roboto Mono)
 * セマンティック変数を使用してダークモード対応
 */

import React from "react";

type TextCodeProps = {
  text?: string;
  className?: string;
};

export default function TextCode({
  text = "Text Code",
  className = ""
}: TextCodeProps) {
  return (
    <div className={`content-stretch flex items-start ${className}`} data-name="Text Code" data-node-id="2104:22325">
      <code className="font-mono font-normal leading-none relative shrink-0 text-foreground text-base text-nowrap whitespace-pre" data-node-id="2104:22323">
        {text}
      </code>
    </div>
  );
}
