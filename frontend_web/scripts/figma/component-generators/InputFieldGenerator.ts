import type {
  ComponentGenerator,
  ComponentInfo,
  GeneratedComponent,
} from "./types";
import { extractProperties, toCamelCase } from "./types";

/**
 * InputField Component Generator
 *
 * 条件:
 * - State, Value Type プロパティを持つ
 * - Error#, Value#, Open# などのboolean プロパティを持つ
 * - プロパティ数が10個
 */
export class InputFieldGenerator implements ComponentGenerator {
  canHandle(component: ComponentInfo): boolean {
    const props = component.componentSetProperties || {};
    const keys = Object.keys(props).sort();

    return (
      keys.length === 10 &&
      keys.includes("State") &&
      keys.includes("Value Type") &&
      keys.some((key) => key.startsWith("Error#")) &&
      keys.some((key) => key.startsWith("Value#")) &&
      keys.some((key) => key.startsWith("Open#"))
    );
  }

  getComponentName(components: ComponentInfo[]): string {
    return "InputField";
  }

  generate(
    components: ComponentInfo[],
    componentName: string,
  ): GeneratedComponent {
    const { propertyNames, defaultValues } = extractProperties(components[0]);

    // State と Value Type の値を収集
    const states = new Set<string>();
    const valueTypes = new Set<string>();

    for (const comp of components) {
      const props = comp.variantProperties || {};
      if (props.State) states.add(props.State);
      if (props["Value Type"]) valueTypes.add(props["Value Type"]);
    }

    const imports = [
      'import type { ComponentPropsWithoutRef } from "react";',
      'import { type VariantProps, cva } from "class-variance-authority";',
      'import { cn } from "@/features/shared/lib/classNames";',
    ];

    const variantsName = toCamelCase(componentName) + "Variants";

    // Boolean プロパティを抽出
    const booleanProps = propertyNames.filter(
      (name) => !["State", "Value Type"].includes(name),
    );

    const propsTypeDefinition = booleanProps
      .map((prop) => {
        const camelName = toCamelCase(prop);
        const defaultVal = defaultValues[prop] || "Label";
        return `  ${camelName}?: ${prop.startsWith("Label#") || prop.startsWith("Error#") || prop.startsWith("Description#") || prop.startsWith("Value#") ? `boolean | string` : "boolean"};`;
      })
      .join("\n");

    const interfaceCode = `export interface ${componentName}Props
  extends ComponentPropsWithoutRef<"input">,
    VariantProps<typeof ${variantsName}> {
${propsTypeDefinition}
}`;

    const componentCode = `const ${variantsName} = cva("", {
  variants: {
    state: {
      default: "",
      error: "",
      disabled: "",
    },
    valueType: {
      default: "",
      placeholder: "",
    },
  },
  defaultVariants: {
    state: "${defaultValues.State?.toLowerCase() || "default"}",
    valueType: "${defaultValues["Value Type"]?.toLowerCase().replace(/\s+/g, "") || "default"}",
  },
});

export function ${componentName}({
  className,
  ${booleanProps.map((p) => toCamelCase(p)).join(", ")},
  state,
  valueType,
  disabled,
  ...props
}: ${componentName}Props) {
  // Boolean または string を受け取り、実際の値を決定
  const labelText = typeof label === "string" ? label : "Label";
  const errorText = typeof error === "string" ? error : "Error message";
  const descriptionText = typeof description === "string" ? description : "Description";
  const valueText = typeof value === "string" ? value : "Value";

  const showError = state === "error" && !!error;
  const isDisabled = disabled || state === "disabled";

  return (
    <div className="space-y-Space-100">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {labelText}
        </label>
      )}
      <input
        className={cn(
          "w-full rounded-md border px-Space-300 py-Space-200 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          state === "error" ? "border-destructive" : "border-border",
          isDisabled &&
            "cursor-not-allowed bg-sds_light-Background-Disabled-Default border-sds_light-Border-Disabled-default text-sds_light-Text-Disabled-On-Disabled",
          ${variantsName}({ state, valueType, className }),
        )}
        placeholder={valueType === "placeholder" ? valueText : undefined}
        defaultValue={valueType === "default" ? valueText : undefined}
        disabled={isDisabled}
        aria-invalid={showError}
        aria-describedby={
          showError
            ? "error-message"
            : description
              ? "description"
              : undefined
        }
        {...props}
      />
      {description && !showError && (
        <p id="description" className="text-sm text-muted-foreground">
          {descriptionText}
        </p>
      )}
      {showError && (
        <p id="error-message" className="text-sm text-destructive">
          {errorText}
        </p>
      )}
    </div>
  );
}`;

    return {
      imports,
      interfaceCode,
      componentCode,
    };
  }
}
