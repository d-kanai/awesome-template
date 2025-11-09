import { figma } from "@figma/code-connect";
import { Button } from "./Button";

/**
 * Code Connect for Button component
 * Links Figma Button component to React implementation
 */

const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || "WoOuJeIanK8Ke56zr6muug";
const figmaUrl = `https://www.figma.com/design/${FIGMA_FILE_KEY}/Simple-Design-System--Community-?node-id=4185-3778`;

figma.connect(Button, figmaUrl, {
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
      Disabled: true,
      Default: false,
      Hover: false,
    }),
    children: figma.textContent("Button text content"),
  },
  example: ({ variant, size, disabled, children }) => (
    <Button variant={variant} size={size} disabled={disabled}>
      {children}
    </Button>
  ),
});
