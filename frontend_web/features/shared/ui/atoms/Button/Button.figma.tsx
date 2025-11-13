import { figma } from "@figma/code-connect";
import { Button } from "./Button";

/**
 * Code Connect for Button component
 * Links Figma Button component to React implementation
 */

figma.connect(
  Button,
  "https://www.figma.com/design/L6MkVNNzgHYqEljdHzs0To/Simple-Design-System--Community-?node-id=4185-3778",
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
        Disabled: true,
        Default: false,
        Hover: false,
      }),
    },
    example: ({ variant, size, disabled }) => (
      <Button variant={variant} size={size} disabled={disabled}>
        Button
      </Button>
    ),
  },
);
