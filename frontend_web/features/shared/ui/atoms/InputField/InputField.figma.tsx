import { figma } from "@figma/code-connect";
import { InputField } from "./InputField";

/**
 * Code Connect for InputField component
 * Links Figma InputField component to React implementation
 */

const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || "WoOuJeIanK8Ke56zr6muug";
const figmaUrl = `https://www.figma.com/design/${FIGMA_FILE_KEY}/Simple-Design-System--Community-?node-id=2136-2263`;

figma.connect(InputField, figmaUrl, {
  props: {
    state: figma.enum("State", {
      Default: "default",
      Error: "error",
      Disabled: "disabled",
    }),
    hasLabel: figma.boolean("Has Label"),
    hasError: figma.boolean("Has Error"),
    hasDescription: figma.boolean("Has Description"),
    label: figma.string("Label"),
    error: figma.string("Error"),
    description: figma.string("Description"),
    placeholder: figma.enum("Value Type", {
      Placeholder: figma.string("Value"),
      Default: undefined,
    }),
    defaultValue: figma.enum("Value Type", {
      Default: figma.string("Value"),
      Placeholder: undefined,
    }),
  },
  example: ({
    state,
    hasLabel,
    hasError,
    hasDescription,
    label,
    error,
    description,
    placeholder,
    defaultValue,
  }) => (
    <InputField
      state={state}
      hasLabel={hasLabel}
      hasError={hasError}
      hasDescription={hasDescription}
      label={label}
      error={error}
      description={description}
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  ),
});
