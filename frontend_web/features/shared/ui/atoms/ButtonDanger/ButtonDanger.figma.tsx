import { figma } from "@figma/code-connect";
import { ButtonDanger } from "./ButtonDanger";

/**
 * Code Connect for ButtonDanger component
 * Links Figma ButtonDanger component to React implementation
 */

const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || "WoOuJeIanK8Ke56zr6muug";
const figmaUrl = `https://www.figma.com/design/${FIGMA_FILE_KEY}/Simple-Design-System--Community-?node-id=185-852`;

figma.connect(ButtonDanger, figmaUrl, {
  props: {
    variant: figma.enum("Variant", {
      Primary: "primary",
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
    <ButtonDanger variant={variant} size={size} disabled={disabled}>
      {children}
    </ButtonDanger>
  ),
});
