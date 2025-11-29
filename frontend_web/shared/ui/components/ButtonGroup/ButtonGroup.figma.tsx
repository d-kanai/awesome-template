import { figma } from "@figma/code-connect";
import { ButtonGroup } from "./ButtonGroup";

/**
 * Code Connect for ButtonGroup component
 * Links Figma ButtonGroup component to React implementation
 */

figma.connect(
  ButtonGroup,
  "https://www.figma.com/design/L6MkVNNzgHYqEljdHzs0To/Simple-Design-System--Community-?node-id=2072-9432",
  {
    props: {
      align: figma.enum("Align", {
        Justify: "Justify",
        Start: "Start",
        End: "End",
        Center: "Center",
        Stack: "Stack",
      }),
    },
    example: ({ align }) => (
      <ButtonGroup
        align={align}
        startButton={{ id: "example-start-button", label: "Button", variant: "neutral" }}
        endButton={{ id: "example-end-button", label: "Button", variant: "primary" }}
      />
    ),
  },
);
