import { figma } from "@figma/code-connect";
import { HeroActions } from "./HeroActions";

/**
 * Code Connect for HeroActions component
 * Links Figma HeroActions component to React implementation
 */

figma.connect(
  HeroActions,
  "https://www.figma.com/design/L6MkVNNzgHYqEljdHzs0To/Simple-Design-System--Community-?node-id=348-15901",
  {
    example: () => (
      <HeroActions
        title="Title"
        subtitle="Subtitle"
        primaryButtonId="hero-primary-button"
        secondaryButtonId="hero-secondary-button"
        primaryButtonText="Button"
        secondaryButtonText="Button"
      />
    ),
  },
);
