import { figma } from "@figma/code-connect";
import { CheckboxField } from "./CheckboxField";

/**
 * Code Connect for CheckboxField component
 * Links Figma CheckboxField component to React implementation
 */

const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || "WoOuJeIanK8Ke56zr6muug";
const figmaUrl = `https://www.figma.com/design/${FIGMA_FILE_KEY}/Simple-Design-System--Community-?node-id=9762-1441`;

figma.connect(CheckboxField, figmaUrl, {
  props: {
    checked: figma.enum("Value Type", {
      Checked: true,
      Unchecked: false,
      Indeterminate: false,
    }),
    indeterminate: figma.enum("Value Type", {
      Indeterminate: true,
      Checked: false,
      Unchecked: false,
    }),
    disabled: figma.enum("State", {
      Disabled: true,
      Default: false,
    }),
    label: figma.string("Label"),
    description: figma.boolean("hasDescription", {
      true: figma.string("Description"),
      false: undefined,
    }),
  },
  example: ({ checked, indeterminate, disabled, label, description }) => (
    <CheckboxField
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      label={label}
      description={description}
    />
  ),
});
