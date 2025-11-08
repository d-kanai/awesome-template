/**
 * Navigation Pill List Component Generator
 *
 * Container component for multiple Navigation Pills
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { convertAutoLayoutToClasses } from "../utils/layout-converter";
import type {
  ComponentGenerator,
  ComponentInfo,
  GeneratedComponent,
} from "./types";

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  layoutMode?: string | null;
  paddingLeft?: number | null;
  paddingRight?: number | null;
  paddingTop?: number | null;
  paddingBottom?: number | null;
  itemSpacing?: number | null;
  primaryAxisAlignItems?: string | null;
  counterAxisAlignItems?: string | null;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  [key: string]: any;
}

export class NavigationPillListGenerator implements ComponentGenerator {
  canHandle(component: ComponentInfo): boolean {
    return (
      component.name === "Navigation Pill List" ||
      component.componentSetName === "Navigation Pill List"
    );
  }

  getComponentName(components: ComponentInfo[]): string {
    return "NavigationPillList";
  }

  private loadNavigationPillListStructure(): FigmaNode | null {
    const pageFile = path.resolve(
      process.cwd(),
      "design-tokens/figma-page-navigation.json",
    );

    if (!fs.existsSync(pageFile)) {
      console.warn("⚠️  figma-page-navigation.json が見つかりません");
      return null;
    }

    const pageData = JSON.parse(fs.readFileSync(pageFile, "utf-8"));

    // Navigation Pill List COMPONENT_SETを探す
    const listSet = this.findNodeByName(pageData.data, "Navigation Pill List");
    if (!listSet || listSet.type !== "COMPONENT_SET") {
      console.warn("⚠️  Navigation Pill List COMPONENT_SET が見つかりません");
      return null;
    }

    // Direction=Row のバリアントを取得
    const rowVariant = listSet.children?.find((child: FigmaNode) =>
      child.name.includes("Direction=Row"),
    );

    return rowVariant || null;
  }

  private findNodeByName(node: FigmaNode, name: string): FigmaNode | null {
    if (node.name === name && node.type === "COMPONENT_SET") return node;

    if (node.children) {
      for (const child of node.children) {
        const found = this.findNodeByName(child, name);
        if (found) return found;
      }
    }

    return null;
  }

  generate(
    components: ComponentInfo[],
    componentName: string,
  ): GeneratedComponent {
    const listStructure = this.loadNavigationPillListStructure();

    if (!listStructure) {
      console.warn("⚠️  Navigation Pill List構造を読み込めませんでした");
      return this.generateBasicList();
    }

    console.log("\n📐 Auto Layout情報を使用してNavigation Pill Listを生成");

    // Auto Layout情報を取得
    const classes = convertAutoLayoutToClasses(listStructure as any);
    console.log(`   クラス: ${classes.join(" ")}`);

    const imports = [
      'import { forwardRef } from "react";',
      'import type { ComponentPropsWithoutRef, ReactNode } from "react";',
      'import { cn } from "@/features/shared/lib/classNames";',
      'import { NavigationPill } from "./NavigationPill";',
    ];

    const interfaceCode = `/**
 * NavigationPillList コンポーネント
 *
 * Navigation Pillのコンテナコンポーネント
 * Auto Layout情報から自動生成
 *
 * @figma 2194:14984
 * @generated Figma REST API + Auto Layout
 */

export interface NavigationPillListProps extends ComponentPropsWithoutRef<"nav"> {
  items?: Array<{
    label: string;
    href?: string;
    active?: boolean;
    onClick?: () => void;
  }>;
  direction?: "row" | "column";
  children?: ReactNode;
}`;

    const componentCode = `export const NavigationPillList = forwardRef<HTMLElement, NavigationPillListProps>(
  function NavigationPillList(
    {
      className,
      items,
      direction = "row",
      children,
      ...props
    },
    ref,
  ) {
    const directionClass = direction === "column" ? "flex-col" : "flex-row";

    return (
      <nav
        ref={ref}
        className={cn("${classes.join(" ")}", directionClass, className)}
        {...props}
      >
        {items ? (
          items.map((item, index) => (
            item.href ? (
              <a key={index} href={item.href}>
                <NavigationPill
                  state={item.active ? "active" : "default"}
                  label={item.label}
                />
              </a>
            ) : (
              <NavigationPill
                key={index}
                state={item.active ? "active" : "default"}
                label={item.label}
                onClick={item.onClick}
              />
            )
          ))
        ) : (
          children
        )}
      </nav>
    );
  },
);`;

    return {
      imports,
      interfaceCode,
      componentCode,
    };
  }

  private generateBasicList(): GeneratedComponent {
    return {
      imports: [
        'import { forwardRef } from "react";',
        'import type { ComponentPropsWithoutRef, ReactNode } from "react";',
        'import { NavigationPill } from "./NavigationPill";',
      ],
      interfaceCode: `export interface NavigationPillListProps extends ComponentPropsWithoutRef<"nav"> {
  items?: Array<{ label: string; href?: string; active?: boolean; onClick?: () => void }>;
  direction?: "row" | "column";
  children?: ReactNode;
}`,
      componentCode: `export const NavigationPillList = forwardRef<HTMLElement, NavigationPillListProps>(
  function NavigationPillList({ items, direction = "row", children, className, ...props }, ref) {
    const directionClass = direction === "column" ? "flex-col gap-Space-200" : "flex-row gap-Space-200";

    return (
      <nav ref={ref} className={\`flex \${directionClass} \${className}\`} {...props}>
        {items ? items.map((item, index) => (
          item.href ? (
            <a key={index} href={item.href}>
              <NavigationPill state={item.active ? "active" : "default"} label={item.label} />
            </a>
          ) : (
            <NavigationPill
              key={index}
              state={item.active ? "active" : "default"}
              label={item.label}
              onClick={item.onClick}
            />
          )
        )) : children}
      </nav>
    );
  },
);`,
    };
  }
}
