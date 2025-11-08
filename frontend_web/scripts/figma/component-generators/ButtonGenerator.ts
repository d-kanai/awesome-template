import type {
  ComponentGenerator,
  ComponentInfo,
  GeneratedComponent,
} from "./types";
import { extractProperties, toCamelCase } from "./types";

/**
 * Button Component Generator
 *
 * 条件:
 * - Variant, Size, State プロパティを持つ
 * - プロパティ数が3つ
 */
export class ButtonGenerator implements ComponentGenerator {
  canHandle(component: ComponentInfo): boolean {
    const props = component.componentSetProperties || {};
    const keys = Object.keys(props)
      .map((key) => key.replace(/#.*$/, ""))
      .sort();

    return (
      keys.length === 3 &&
      keys.includes("Variant") &&
      keys.includes("Size") &&
      keys.includes("State")
    );
  }

  getComponentName(components: ComponentInfo[]): string {
    return "ButtonNew";
  }

  generate(
    components: ComponentInfo[],
    componentName: string,
  ): GeneratedComponent {
    const { propertyNames, propertyTypes, defaultValues } =
      extractProperties(components[0]);

    // Variant の値を収集
    const variants = new Set<string>();
    const sizes = new Set<string>();
    const states = new Set<string>();

    for (const comp of components) {
      const props = comp.variantProperties || {};
      if (props.Variant) variants.add(props.Variant);
      if (props.Size) sizes.add(props.Size);
      if (props.State) states.add(props.State);
    }

    const variantValues = Array.from(variants)
      .map((v) => `"${v.toLowerCase()}"`)
      .join(", ");
    const sizeValues = Array.from(sizes)
      .map((s) => `"${s.toLowerCase()}"`)
      .join(", ");
    const stateValues = Array.from(states)
      .map((s) => `"${s.toLowerCase()}"`)
      .join(", ");

    const imports = [
      'import type { ComponentPropsWithoutRef } from "react";',
      'import { type VariantProps, cva } from "class-variance-authority";',
      'import { cn } from "@/features/shared/lib/classNames";',
    ];

    const variantsName = toCamelCase(componentName) + "Variants";

    const interfaceCode = `export interface ${componentName}Props
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof ${variantsName}> {}`;

    const componentCode = `const ${variantsName} = cva(
  "inline-flex items-center justify-center rounded-md text-body-small-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-ring",
        subtle: "bg-secondary text-secondary-foreground hover:bg-secondary-hover focus-visible:ring-ring",
        neutral: "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
      },
      size: {
        small: "h-9 px-Space-300 text-body-small",
        medium: "h-10 px-Space-400 py-Space-200",
      },
      state: {
        default: "",
        hover: "",
        disabled: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "${defaultValues.Variant?.toLowerCase() || "primary"}",
      size: "${defaultValues.Size?.toLowerCase() || "medium"}",
      state: "default",
    },
  },
);

export function ${componentName}({
  className,
  variant,
  size,
  state,
  disabled,
  ...props
}: ${componentName}Props) {
  const isDisabled = disabled || state === "disabled";

  return (
    <button
      className={cn(${variantsName}({ variant, size, state, className }))}
      disabled={isDisabled}
      {...props}
    />
  );
}`;

    return {
      imports,
      interfaceCode,
      componentCode,
    };
  }
}
