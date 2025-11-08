/**
 * Header Component Generator
 *
 * Figma ページから取得したHeader構造を元にReactコンポーネントを生成
 * Auto Layout情報を活用してレイアウトを正確に再現
 */

import * as path from "node:path";
import {
  BaseComponentGenerator,
  type FigmaNode,
} from "./BaseComponentGenerator";
import type {
  ComponentGenerator,
  ComponentInfo,
  GeneratedComponent,
} from "./types";

export class HeaderGenerator
  extends BaseComponentGenerator
  implements ComponentGenerator
{
  canHandle(component: ComponentInfo): boolean {
    return (
      component.name === "Header" || component.componentSetName === "Header"
    );
  }

  getComponentName(components: ComponentInfo[]): string {
    return "Header";
  }

  /**
   * INSTANCEノードの依存関係を抽出
   */
  private extractDependencies(
    node: FigmaNode,
  ): Array<{ componentId: string; name: string }> {
    const deps: Array<{ componentId: string; name: string }> = [];

    function traverse(n: FigmaNode) {
      if (n.type === "INSTANCE" && n.componentId) {
        deps.push({ componentId: n.componentId, name: n.name });
      }
      if (n.children) {
        for (const child of n.children) {
          traverse(child);
        }
      }
    }

    traverse(node);
    return deps;
  }

  generate(
    components: ComponentInfo[],
    componentName: string,
  ): GeneratedComponent {
    // Figma Page JSON から Header COMPONENT_SET を取得
    const pageFile = path.resolve(
      process.cwd(),
      "design-tokens/figma-page-sections.json",
    );

    const headerSet = this.findComponentSet(pageFile, "Header");
    if (!headerSet) {
      console.warn("⚠️  Header COMPONENT_SET が見つかりません");
      return this.generateBasicHeader(components, componentName);
    }

    // Platform=Desktop, State=Default のバリアントを取得
    const desktopVariant = this.findVariant(
      headerSet,
      (name) =>
        name.includes("Platform=Desktop") && name.includes("State=Default"),
    );

    if (!desktopVariant) {
      console.warn("⚠️  Desktop Default variant が見つかりません");
      return this.generateBasicHeader(components, componentName);
    }

    console.log("\n📐 Auto Layout情報を使用してHeaderを生成");

    // ルートのAuto Layout情報を取得
    const rootClasses = this.extractLayoutClasses(desktopVariant);
    console.log(`   ルートクラス: ${rootClasses.join(" ")}`);

    // 依存関係を抽出
    const dependencies = this.extractDependencies(desktopVariant);
    console.log(`   依存コンポーネント: ${dependencies.length}個`);
    for (const dep of dependencies) {
      console.log(`     - ${dep.name} (${dep.componentId})`);
    }

    // 子要素を解析
    const children = desktopVariant.children || [];
    const childElements = children.map((child, index) => {
      const childClasses = this.extractLayoutClasses(child);
      return {
        name: child.name,
        type: child.type,
        componentId: child.componentId,
        classes: childClasses,
        index,
      };
    });

    // インポート文を生成
    const imports = [
      'import { forwardRef } from "react";',
      'import type { ComponentPropsWithoutRef } from "react";',
      'import { type VariantProps, cva } from "class-variance-authority";',
      'import { cn } from "@/features/shared/lib/classNames";',
    ];

    // 依存コンポーネントをimport
    imports.push('import { Button } from "./Button";');
    imports.push('import { IconButton } from "./IconButton";');
    imports.push('import { NavigationPillList } from "./NavigationPillList";');

    // Variant定義（Platform と State）
    const variantsCode = this.generateVariantsCode(desktopVariant, rootClasses);

    // Interface定義
    const interfaceCode = `/**
 * Header コンポーネント
 *
 * ページ上部のナビゲーションヘッダー
 * Auto Layout情報から自動生成
 *
 * @figma 2287:22651
 * @generated Figma REST API + Auto Layout
 */

export interface HeaderProps
  extends ComponentPropsWithoutRef<"header">,
    VariantProps<typeof headerVariants> {
  platform?: "desktop" | "mobile";
  state?: "default" | "open";
}

${variantsCode}`;

    // Component本体を生成
    const componentCode = this.generateComponentCode(childElements);

    return {
      imports,
      interfaceCode,
      componentCode,
    };
  }

  private generateVariantsCode(
    desktopVariant: FigmaNode,
    rootClasses: string[],
  ): string {
    // 高さ情報を取得
    const height = desktopVariant.absoluteBoundingBox?.height || 99;

    return `const headerVariants = cva(
  "${rootClasses.join(" ")} bg-background border-b border-border",
  {
    variants: {
      platform: {
        desktop: "h-[${height}px]",
        mobile: "h-[84px]",
      },
      state: {
        default: "",
        open: "",
      },
    },
    defaultVariants: {
      platform: "desktop",
      state: "default",
    },
  },
);`;
  }

  private generateComponentCode(
    childElements: Array<{
      name: string;
      type: string;
      componentId?: string;
      classes: string[];
      index: number;
    }>,
  ): string {
    return `export const Header = forwardRef<HTMLElement, HeaderProps>(
  function Header(
    {
      className,
      platform = "desktop",
      state = "default",
      ...props
    },
    ref,
  ) {
    return (
      <header
        ref={ref}
        className={cn(headerVariants({ platform, state, className }))}
        {...props}
      >
${this.generateChildrenJSX(childElements)}
      </header>
    );
  },
);`;
  }

  private generateChildrenJSX(
    childElements: Array<{
      name: string;
      type: string;
      componentId?: string;
      classes: string[];
      index: number;
    }>,
  ): string {
    const jsxParts: string[] = [];

    for (const child of childElements) {
      if (child.name === "Block") {
        // ロゴ部分とモバイルメニューボタン
        jsxParts.push(`        {/* Logo/Brand Section */}
        <div className="${child.classes.join(" ")}">
          {platform === "mobile" && (
            <IconButton
              variant="neutral"
              size="medium"
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h14M3 10h14M3 14h14" />
                </svg>
              }
              aria-label="Menu"
            />
          )}
          <div className="w-10 h-[35px] bg-primary" aria-label="Logo">
            {/* Placeholder for logo */}
          </div>
        </div>`);
      } else if (child.name === "Navigation Pill List") {
        // ナビゲーション（Desktop のみ）
        jsxParts.push(`
        {/* Navigation Section - Desktop only */}
        {platform === "desktop" && (
          <NavigationPillList
            className="${child.classes.join(" ")}"
            items={[
              { label: "Products", href: "#", active: true },
              { label: "Solutions", href: "#" },
              { label: "Community", href: "#" },
              { label: "Resources", href: "#" },
              { label: "Pricing", href: "#" },
              { label: "Contact", href: "#" },
              { label: "Link", href: "#" },
            ]}
          />
        )}`);
      } else if (child.name === "Header Auth") {
        // 認証ボタン
        jsxParts.push(`
        {/* Auth Buttons Section */}
        <div className="${child.classes.join(" ")}">
          <Button variant="neutral" size="small">
            Sign in
          </Button>
          <Button variant="primary" size="small">
            Register
          </Button>
        </div>`);
      }
    }

    return jsxParts.join("\n");
  }

  /**
   * フォールバック: 基本的なHeaderを生成
   */
  private generateBasicHeader(
    components: ComponentInfo[],
    componentName: string,
  ): GeneratedComponent {
    return {
      imports: [
        'import { forwardRef } from "react";',
        'import type { ComponentPropsWithoutRef } from "react";',
        'import { Button } from "./Button";',
      ],
      interfaceCode: `export interface HeaderProps extends ComponentPropsWithoutRef<"header"> {
  platform?: "desktop" | "mobile";
}`,
      componentCode: `export const Header = forwardRef<HTMLElement, HeaderProps>(
  function Header({ className, platform = "desktop", ...props }, ref) {
    return (
      <header ref={ref} className={\`flex items-center justify-between p-4 bg-background border-b \${className}\`} {...props}>
        <div>Logo</div>
        <nav>Navigation</nav>
        <Button variant="primary" size="small">Sign in</Button>
      </header>
    );
  },
);`,
    };
  }
}
