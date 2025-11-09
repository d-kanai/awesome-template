/**
 * ============================================
 * 🔗 Figma Code Connect
 * 📅 Created at: 2025-11-09 09:54:30 JST
 * 🔗 Node ID: 4185:3778
 * ============================================
 *
 * This file connects the Figma component to the React implementation.
 * It enables Figma to show real code snippets in Dev Mode.
 */

import figma from "@figma/code-connect";
import ButtonWithIcons from "./ButtonWithIcons";

// Figma File Key from environment variable
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || "WoOuJeIanK8Ke56zr6muug";
const FIGMA_URL = `https://www.figma.com/design/${FIGMA_FILE_KEY}`;

/**
 * Code Connect for ButtonWithIcons component
 *
 * Maps Figma variants to React props:
 * - Variant (Primary/Neutral/Subtle) → variant prop
 * - State (Default/Hover/Disabled) → disabled prop
 * - Size (Medium/Small) → size prop
 */
figma.connect(
  ButtonWithIcons,
  `${FIGMA_URL}?node-id=4185:3778`,
  {
    props: {
      variant: figma.enum("Variant", {
        Primary: "primary",
        Neutral: "neutral",
        Subtle: "subtle",
      }),
      size: figma.enum("Size", {
        Medium: "medium",
        Small: "small",
      }),
      disabled: figma.enum("State", {
        Default: false,
        Hover: false,
        Disabled: true,
      }),
      children: figma.textContent("Button Text"),
    },
    example: ({ variant, size, disabled, children }) => (
      <ButtonWithIcons
        variant={variant}
        size={size}
        disabled={disabled}
      >
        {children}
      </ButtonWithIcons>
    ),
  }
);

/**
 * Example with left icon
 */
figma.connect(
  ButtonWithIcons,
  `${FIGMA_URL}?node-id=4185:3778`,
  {
    variant: { "Has Icon": "Left" },
    props: {
      variant: figma.enum("Variant", {
        Primary: "primary",
        Neutral: "neutral",
        Subtle: "subtle",
      }),
      size: figma.enum("Size", {
        Medium: "medium",
        Small: "small",
      }),
      children: figma.textContent("Button Text"),
    },
    example: ({ variant, size, children }) => (
      <ButtonWithIcons
        variant={variant}
        size={size}
        leftIcon={<StarIcon />}
      >
        {children}
      </ButtonWithIcons>
    ),
  }
);

/**
 * Example with right icon
 */
figma.connect(
  ButtonWithIcons,
  `${FIGMA_URL}?node-id=4185:3778`,
  {
    variant: { "Has Icon": "Right" },
    props: {
      variant: figma.enum("Variant", {
        Primary: "primary",
        Neutral: "neutral",
        Subtle: "subtle",
      }),
      size: figma.enum("Size", {
        Medium: "medium",
        Small: "small",
      }),
      children: figma.textContent("Button Text"),
    },
    example: ({ variant, size, children }) => (
      <ButtonWithIcons
        variant={variant}
        size={size}
        rightIcon={<XIcon />}
      >
        {children}
      </ButtonWithIcons>
    ),
  }
);
