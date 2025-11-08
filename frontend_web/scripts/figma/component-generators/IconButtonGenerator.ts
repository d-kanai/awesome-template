import type {
  ComponentGenerator,
  ComponentInfo,
  GeneratedComponent,
} from "./types";
import { extractProperties, toCamelCase } from "./types";

/**
 * IconButton Component Generator
 *
 * 条件:
 * - Variant, Size, State プロパティを持つ
 * - プロパティ数が4つ (Variant, Size, State, Icon)
 */
export class IconButtonGenerator implements ComponentGenerator {
  canHandle(component: ComponentInfo): boolean {
    const props = component.componentSetProperties || {};
    const keys = Object.keys(props)
      .map((key) => key.replace(/#.*$/, ""))
      .sort();

    // Icon Buttonは pageName が "Icon Buttons" であることで判定
    return (
      keys.length === 4 &&
      keys.includes("Variant") &&
      keys.includes("Size") &&
      keys.includes("State") &&
      keys.includes("Icon") &&
      (component.componentSetName === "Icon Buttons" ||
        component.name?.includes("Icon Button"))
    );
  }

  getComponentName(components: ComponentInfo[]): string {
    return "IconButton";
  }

  generate(
    components: ComponentInfo[],
    componentName: string,
  ): GeneratedComponent {
    const { defaultValues } = extractProperties(components[0]);

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

    const imports = [
      'import { forwardRef } from "react";',
      'import type { ComponentPropsWithoutRef, ReactNode } from "react";',
      'import { type VariantProps, cva } from "class-variance-authority";',
      'import { cn } from "@/features/shared/lib/classNames";',
    ];

    const variantsName = toCamelCase(componentName) + "Variants";

    const interfaceCode = `export interface ${componentName}Props
  extends Omit<ComponentPropsWithoutRef<"button">, "children">,
    VariantProps<typeof ${variantsName}> {
  icon: ReactNode;
}`;

    const componentCode = `const ${variantsName} = cva(
  "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-ring",
        subtle: "bg-secondary text-secondary-foreground hover:bg-secondary-hover focus-visible:ring-ring",
        neutral: "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring",
      },
      size: {
        small: "h-8 w-8 text-sm",
        medium: "h-10 w-10",
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

export const ${componentName} = forwardRef<HTMLButtonElement, ${componentName}Props>(
  function ${componentName}(
    {
      className,
      variant,
      size,
      state,
      icon,
      disabled,
      ...props
    },
    ref,
  ) {
    const isDisabled = disabled || state === "disabled";

    return (
      <button
        ref={ref}
        className={cn(${variantsName}({ variant, size, state, className }))}
        disabled={isDisabled}
        {...props}
      >
        {icon}
      </button>
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
