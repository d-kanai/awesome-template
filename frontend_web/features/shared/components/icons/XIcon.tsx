/**
 * X (Close) Icon - Figmaから取り込み
 */

import React from "react";

type XIconProps = {
  className?: string;
  color?: string;
};

export default function XIcon({ className = "", color = "currentColor" }: XIconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
