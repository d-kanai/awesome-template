/**
 * Navigation Pill Component Generator
 *
 * Simple navigation pill with State variants (Active, Default, Hover)
 */

import * as path from "node:path";
import { BaseComponentGenerator } from "./BaseComponentGenerator";
import type {
  ComponentGenerator,
  ComponentInfo,
  GeneratedComponent,
} from "./types";

export class NavigationPillGenerator
  extends BaseComponentGenerator
  implements ComponentGenerator
{
  canHandle(component: ComponentInfo): boolean {
    return (
      component.name === "Navigation Pill" ||
      component.componentSetName === "Navigation Pill"
    );
  }

  getComponentName(components: ComponentInfo[]): string {
    return "NavigationPill";
  }

  generate(
    components: ComponentInfo[],
    componentName: string,
  ): GeneratedComponent {
    // Figma Page JSON から Navigation Pill COMPONENT_SET を取得
    const pageFile = path.resolve(
      process.cwd(),
      "design-tokens/figma-page-navigation.json",
    );

    const pillSet = this.findComponentSet(pageFile, "Navigation Pill");
    if (!pillSet) {
      console.warn("⚠️  Navigation Pill COMPONENT_SET が見つかりません");
      return this.generateBasicPill();
    }

    console.log("\n📐 Auto Layout情報を使用してNavigation Pillを生成");

    // デフォルトバリアントを取得
    const defaultVariant = this.findVariant(pillSet, (name) =>
      name.includes("State=Default"),
    );

    if (!defaultVariant) {
      console.warn("⚠️  Default variant が見つかりません");
      return this.generateBasicPill();
    }

    // すべてのバリアント情報を抽出
    const allVariants = this.extractAllVariants(pillSet);

    // レイアウトと Corner Radius をログ出力
    const layoutClasses = this.extractLayoutClasses(defaultVariant);
    const cornerRadiusClass = this.extractCornerRadiusClass(defaultVariant);
    console.log(`   レイアウトクラス: ${layoutClasses.join(" ")}`);
    console.log(
      `   Corner Radius: ${defaultVariant.cornerRadius}px → ${cornerRadiusClass}`,
    );

    // State別の色情報を抽出
    const stateVariants: Record<
      string,
      { bgClass: string; textClass: string }
    > = {};
    for (const [variantName, info] of allVariants.entries()) {
      const props = this.parseVariantName(variantName);
      if (props.State) {
        const stateName = props.State.toLowerCase();
        stateVariants[stateName] = info.colors;
        console.log(
          `   ${props.State}: ${info.colors.bgClass} ${info.colors.textClass}`,
        );
      }
    }

    const imports = [
      'import { forwardRef } from "react";',
      'import type { ComponentPropsWithoutRef } from "react";',
      'import { type VariantProps, cva } from "class-variance-authority";',
      'import { cn } from "@/features/shared/lib/classNames";',
    ];

    const baseClasses = `${layoutClasses.join(" ")} ${cornerRadiusClass} transition-colors`;

    const defaultColors = stateVariants.default || {
      bgClass: "bg-transparent",
      textClass: "text-foreground",
    };
    const activeColors = stateVariants.active || {
      bgClass: "bg-accent",
      textClass: "text-foreground",
    };
    const hoverColors = stateVariants.hover || {
      bgClass: "bg-accent",
      textClass: "text-foreground",
    };

    const interfaceCode = `/**
 * NavigationPill コンポーネント
 *
 * ナビゲーション用のピル型ボタン
 * Auto Layout情報から自動生成
 *
 * @figma 7768:19970
 * @generated Figma REST API + Auto Layout
 */

export interface NavigationPillProps
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof navigationPillVariants> {
  label?: string;
  state?: "active" | "default" | "hover";
}

const navigationPillVariants = cva(
  "${baseClasses}",
  {
    variants: {
      state: {
        active: "${activeColors.bgClass} ${activeColors.textClass}",
        default: "${defaultColors.bgClass} ${defaultColors.textClass} hover:${hoverColors.bgClass}",
        hover: "${hoverColors.bgClass} ${hoverColors.textClass}",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);`;

    const componentCode = `export const NavigationPill = forwardRef<HTMLButtonElement, NavigationPillProps>(
  function NavigationPill(
    {
      className,
      state = "default",
      label,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(navigationPillVariants({ state, className }))}
        {...props}
      >
        <span className="text-body-small">{label || children}</span>
      </button>
    );
  },
);`;

    return {
      imports,
      interfaceCode,
      componentCode,
    };
  }

  private generateBasicPill(): GeneratedComponent {
    return {
      imports: [
        'import { forwardRef } from "react";',
        'import type { ComponentPropsWithoutRef } from "react";',
      ],
      interfaceCode: `export interface NavigationPillProps extends ComponentPropsWithoutRef<"button"> {
  label?: string;
  state?: "active" | "default" | "hover";
}`,
      componentCode: `export const NavigationPill = forwardRef<HTMLButtonElement, NavigationPillProps>(
  function NavigationPill({ label, state = "default", children, className, ...props }, ref) {
    const stateClasses = {
      active: "bg-primary text-primary-foreground",
      default: "bg-transparent text-foreground hover:bg-accent",
      hover: "bg-accent text-accent-foreground",
    };

    return (
      <button
        ref={ref}
        className={\`px-Space-200 py-Space-150 rounded-full text-body-small transition-colors \${stateClasses[state]} \${className}\`}
        {...props}
      >
        {label || children}
      </button>
    );
  },
);`,
    };
  }
}
