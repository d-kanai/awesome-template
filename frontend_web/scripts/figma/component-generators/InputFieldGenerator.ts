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
 * - Label#, Description#, Has Description# などのプロパティを持つ
 * - プロパティ数が5個
 */
export class InputFieldGenerator implements ComponentGenerator {
  canHandle(component: ComponentInfo): boolean {
    const props = component.componentSetProperties || {};
    const keys = Object.keys(props).sort();

    // NOTE: 実際のFigmaデータは5プロパティ（Label#, Description#, Has Description#, State, Value Type）
    // 以前は10プロパティを想定していたが、fetch-components.tsの抽出により簡略化されている
    return (
      keys.length === 5 &&
      keys.includes("State") &&
      keys.includes("Value Type") &&
      keys.some((key) => key.startsWith("Label#")) &&
      keys.some((key) => key.startsWith("Description#")) &&
      keys.some((key) => key.startsWith("Has Description#"))
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
      'import { forwardRef } from "react";',
      'import type { ComponentPropsWithoutRef } from "react";',
      'import { type VariantProps, cva } from "class-variance-authority";',
      'import { cn } from "@/features/shared/lib/classNames";',
    ];

    const variantsName = `${toCamelCase(componentName)}Variants`;

    // InputFieldの固定Props（Figmaのプロパティ数が減ったため、手動で定義）
    const interfaceCode = `export interface ${componentName}Props
  extends ComponentPropsWithoutRef<"input">,
    VariantProps<typeof ${variantsName}> {
  hasLabel?: boolean;
  label?: string;
  hasError?: boolean;
  error?: string;
  hasDescription?: boolean;
  description?: string;
  value?: string;
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
    valueType: "${
      defaultValues["Value Type"]?.toLowerCase() === "checked" ||
      defaultValues["Value Type"]?.toLowerCase() === "unchecked" ||
      defaultValues["Value Type"]?.toLowerCase() === "indeterminate"
        ? "default"
        : defaultValues["Value Type"]?.toLowerCase().replace(/\s+/g, "") ||
          "default"
    }",
  },
});

export const ${componentName} = forwardRef<HTMLInputElement, ${componentName}Props>(
  function ${componentName}(
    {
      className,
      hasLabel,
      label = "Label",
      hasError,
      error = "Error message",
      hasDescription,
      description = "Description",
      value = "Value",
      state,
      valueType,
      disabled,
      ...props
    },
    ref,
  ) {
    const showError = state === "error" && hasError;
    const isDisabled = disabled || state === "disabled";

    return (
      <div className="space-y-Space-100">
        {hasLabel && (
          <label className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-md border px-Space-300 py-Space-200 text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            state === "error" ? "border-destructive" : "border-border",
            isDisabled &&
              "cursor-not-allowed bg-sds_light-Background-Disabled-Default border-sds_light-Border-Disabled-default text-sds_light-Text-Disabled-On-Disabled",
            ${variantsName}({ state, valueType, className }),
          )}
          placeholder={valueType === "placeholder" ? value : undefined}
          defaultValue={valueType === "default" ? value : undefined}
          disabled={isDisabled}
          aria-invalid={showError}
          aria-describedby={
            showError
              ? "error-message"
              : hasDescription
                ? "description"
                : undefined
          }
          {...props}
        />
        {hasDescription && !showError && (
          <p id="description" className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {showError && (
          <p id="error-message" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  },
)`;

    return {
      imports,
      interfaceCode,
      componentCode,
    };
  }
}
