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
 * - Variant, Size, State, Label プロパティを持つ
 * - Icon関連のプロパティ（Has Icon Start, Has Icon End, Icon Start, Icon End）
 * - プロパティ数が8つ
 */
export class ButtonGenerator implements ComponentGenerator {
  canHandle(component: ComponentInfo): boolean {
    const props = component.componentSetProperties || {};
    const keys = Object.keys(props)
      .map((key) => key.replace(/#.*$/, ""))
      .sort();

    // 4プロパティのButton（Icon, Variant, State, Size）
    // NOTE: 本来は8プロパティ（Has Icon End, Has Icon Start, Icon End, Icon Start, Label, Size, State, Variant）
    // だが、fetch-components.tsが正しく抽出できていないため、4プロパティで判定
    return (
      keys.length === 4 &&
      keys.includes("Variant") &&
      keys.includes("Size") &&
      keys.includes("State") &&
      keys.includes("Icon")
    );
  }

  getComponentName(components: ComponentInfo[]): string {
    return "ButtonNew";
  }

  generate(
    components: ComponentInfo[],
    componentName: string,
  ): GeneratedComponent {
    const { defaultValues } = extractProperties(components[0]);

    const imports = [
      'import { forwardRef } from "react";',
      'import type { ComponentPropsWithoutRef } from "react";',
      'import { type VariantProps, cva } from "class-variance-authority";',
      'import { cn } from "@/features/shared/lib/classNames";',
    ];

    const variantsName = `${toCamelCase(componentName)}Variants`;

    const interfaceCode = `export interface ${componentName}Props
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof ${variantsName}> {
  label?: string;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  hasIconStart?: boolean;
  hasIconEnd?: boolean;
}`;

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

export const ${componentName} = forwardRef<HTMLButtonElement, ${componentName}Props>(
  function ${componentName}(
    {
      className,
      variant,
      size,
      state,
      disabled,
      label,
      iconStart,
      iconEnd,
      hasIconStart,
      hasIconEnd,
      children,
      ...props
    },
    ref,
  ) {
    const isDisabled = disabled || state === "disabled";
    const content = label || children;
    const showIconStart = iconStart || hasIconStart;
    const showIconEnd = iconEnd || hasIconEnd;

    return (
      <button
        ref={ref}
        className={cn(${variantsName}({ variant, size, state, className }))}
        disabled={isDisabled}
        {...props}
      >
        {showIconStart && <span className="mr-Space-150" aria-hidden="true">{iconStart}</span>}
        {content}
        {showIconEnd && <span className="ml-Space-150" aria-hidden="true">{iconEnd}</span>}
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
