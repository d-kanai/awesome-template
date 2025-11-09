/**
 * Text Link Component - Figmaから自動生成
 *
 * Generated from Figma
 * Node ID: 2087:8483
 *
 * Typography: Body Link (16px, Regular, Inter, underline)
 * セマンティック変数を使用してダークモード対応
 */

import React from "react";

type TextLinkProps = {
  text?: string;
  href?: string;
  className?: string;
};

export default function TextLink({
  text = "Text Link",
  href = "#",
  className = ""
}: TextLinkProps) {
  return (
    <div className={`content-stretch flex items-start ${className}`} data-name="Text Link" data-node-id="2087:8483">
      <a href={href} className="font-sans font-normal leading-[1.4] not-italic relative shrink-0 text-foreground text-base text-nowrap underline whitespace-pre hover:text-foreground-secondary transition-colors" data-node-id="2087:8471">
        {text}
      </a>
    </div>
  );
}
