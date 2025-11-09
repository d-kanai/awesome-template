/**
 * ============================================
 * 🎨 Generated from Figma
 * 📅 Generated at: 2025-11-09 09:05:15 JST
 * 🔗 Node ID: 9762:696
 * ============================================
 *
 * Dialog Body Component
 *
 * Types:
 * - Card: Rounded corners with border all around
 * - Sheet: Border only on top (bottom sheet style)
 *
 * Features:
 * - Dismissible close button (optional)
 * - Button group (2 buttons: neutral + primary)
 * - Semantic variables for dark mode
 * - forwardRef support
 */

import React from "react";
import XIcon from "../../components/icons/XIcon";
import ButtonWithIcons from "../ButtonWithIcons";
import TextHeading from "../TextHeading";
import Text from "../Text";

type DialogBodyProps = {
  type?: "Card" | "Sheet";
  heading?: string;
  body?: string;
  dismissible?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  onClose?: () => void;
  className?: string;
};

const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(
  (
    {
      type = "Card",
      heading = "Text Heading",
      body = "Body text",
      dismissible = true,
      primaryButtonText = "Button",
      secondaryButtonText = "Button",
      onPrimaryClick,
      onSecondaryClick,
      onClose,
      className = "",
    },
    ref
  ) => {
    const closeButton = dismissible && (
      <button
        onClick={onClose}
        className="absolute box-border content-stretch flex items-center justify-center overflow-clip p-Space-200 right-2 rounded-full top-2 hover:bg-accent transition-colors"
        aria-label="Close dialog"
        data-name="Icon Button"
        data-node-id="227:16985"
      >
        <XIcon className="size-4" />
      </button>
    );

    const baseClassName = type === "Sheet" ? sheetStyles : cardStyles;

    return (
      <div
        ref={ref}
        className={`${baseClassName} ${className}`.trim()}
        role="dialog"
        aria-labelledby="dialog-heading"
        data-name={`Type=${type}`}
        data-node-id={type === "Sheet" ? "228:12297" : "9762:697"}
      >
        {/* Text Content */}
        <div
          className={`content-stretch flex flex-col gap-Space-300 items-start not-italic relative shrink-0 w-full ${
            type === "Sheet" ? "min-h-[160px]" : ""
          }`}
          data-name="Text"
        >
          <TextHeading text={heading} />
          <Text text={body} />
        </div>

        {/* Button Group */}
        <div
          className="content-stretch flex gap-Space-400 items-center justify-end relative shrink-0 w-full"
          data-name="Button Group"
        >
          <ButtonWithIcons
            variant="neutral"
            size="medium"
            onClick={onSecondaryClick}
          >
            {secondaryButtonText}
          </ButtonWithIcons>
          <ButtonWithIcons
            variant="primary"
            size="medium"
            onClick={onPrimaryClick}
          >
            {primaryButtonText}
          </ButtonWithIcons>
        </div>

        {/* Close Button */}
        {closeButton}
      </div>
    );
  }
);

DialogBody.displayName = "DialogBody";

// Card style: rounded with full border
const cardStyles =
  "bg-background border-border border border-solid box-border content-stretch flex flex-col gap-Space-600 items-start max-w-[600px] p-Space-800 rounded-lg w-[466px] shadow-lg relative";

// Sheet style: border only on top (bottom sheet)
const sheetStyles =
  "bg-background border-border border-b-0 border-l-0 border-r-0 border-solid border-t box-border content-stretch flex flex-col gap-Space-600 items-start p-Space-800 w-[466px] relative";

export default DialogBody;
