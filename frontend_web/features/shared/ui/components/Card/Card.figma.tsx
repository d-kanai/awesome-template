import { figma } from "@figma/code-connect";
import { Card } from "./Card";

/**
 * Code Connect for Card component
 * Links Figma Card component to React implementation
 */

const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || "WoOuJeIanK8Ke56zr6muug";
const figmaUrl = `https://www.figma.com/design/${FIGMA_FILE_KEY}/Simple-Design-System--Community-?node-id=2142-11380`;

figma.connect(Card, figmaUrl, {
  props: {
    assetType: figma.enum("Asset Type", {
      Icon: "icon",
      Image: "image",
    }),
    variant: figma.enum("Variant", {
      Default: "default",
      Stroke: "stroke",
    }),
    direction: figma.enum("Direction", {
      Horizontal: "horizontal",
      Vertical: "vertical",
    }),
    title: figma.string("Title"),
    description: figma.string("Body text"),
    buttonText: figma.string("Button text"),
  },
  example: ({ assetType, variant, direction, title, description, buttonText }) => (
    <Card
      assetType={assetType}
      variant={variant}
      direction={direction}
      title={title}
      description={description}
      buttonText={buttonText}
    />
  ),
});
