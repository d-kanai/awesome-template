import * as fs from "node:fs";
import * as path from "node:path";

interface ComponentProperty {
  type: string;
  defaultValue: string | boolean;
  variantOptions?: string[];
}

interface ComponentInfo {
  key: string;
  name: string;
  description: string;
  nodeId: string;
  type: string;
  properties: Record<string, ComponentProperty>;
  pageName?: string;
}

interface FigmaComponentsData {
  generatedAt: string;
  fileKey: string;
  componentDetails: ComponentInfo[];
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s/=]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function generateVariantType(
  propName: string,
  prop: ComponentProperty,
): string {
  if (prop.type === "VARIANT" && prop.variantOptions) {
    const options = prop.variantOptions.map((opt) => `"${opt}"`).join(" | ");
    return `${toCamelCase(propName)}?: ${options};`;
  }
  if (prop.type === "BOOLEAN") {
    return `${toCamelCase(propName)}?: boolean;`;
  }
  if (prop.type === "TEXT") {
    return `${toCamelCase(propName)}?: string;`;
  }
  return `${toCamelCase(propName)}?: string;`;
}

function generateComponentCode(component: ComponentInfo): string {
  const componentName = toPascalCase(component.name);
  const hasVariants = Object.keys(component.properties).length > 0;

  // プロパティ定義
  const propsDefinition = Object.entries(component.properties)
    .map(([name, prop]) => `  ${generateVariantType(name, prop)}`)
    .join("\n");

  const propsInterface = propsDefinition
    ? `export interface ${componentName}Props extends ComponentPropsWithoutRef<"div"> {
${propsDefinition}
}`
    : `export interface ${componentName}Props extends ComponentPropsWithoutRef<"div"> {}`;

  // CVA variants定義
  const cvaVariants = Object.entries(component.properties)
    .filter(([_, prop]) => prop.type === "VARIANT" && prop.variantOptions)
    .map(([name, prop]) => {
      const variantName = toCamelCase(name);
      const options = prop
        .variantOptions!.map((opt) => `        ${toCamelCase(opt)}: "",`)
        .join("\n");
      return `      ${variantName}: {\n${options}\n      }`;
    })
    .join(",\n");

  const defaultVariants = Object.entries(component.properties)
    .filter(([_, prop]) => prop.type === "VARIANT")
    .map(([name, prop]) => {
      const variantName = toCamelCase(name);
      const defaultValue =
        typeof prop.defaultValue === "string"
          ? toCamelCase(prop.defaultValue)
          : "undefined";
      return `      ${variantName}: "${defaultValue}"`;
    })
    .join(",\n");

  const cvaSection = hasVariants
    ? `
const ${toCamelCase(componentName)}Variants = cva(
  "// TODO: Figmaから取得したbase classesをここに追加\n  // Text Styles: .text-{style-name} (figma-styles.css)\n  // Color Styles: bg-{colorName} または text-{colorName} (figma-theme.ts)\n  // Effect Styles: shadow-{effectName} (figma-theme.ts)",
  {
    variants: {
${cvaVariants}
    },
    defaultVariants: {
${defaultVariants}
    },
  },
);
`
    : "";

  // プロパティの分割代入
  const propDestructuring = Object.keys(component.properties)
    .map((name) => toCamelCase(name))
    .join(", ");

  const componentBody = hasVariants
    ? `export function ${componentName}({
  className,
  ${propDestructuring},
  children,
  ...props
}: ${componentName}Props) {
  return (
    <div
      className={cn(${toCamelCase(componentName)}Variants({ ${propDestructuring}, className }))}
      {...props}
    >
      {children}
    </div>
  );
}`
    : `export function ${componentName}({
  className,
  children,
  ...props
}: ${componentName}Props) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}`;

  const imports = hasVariants
    ? `import type { ComponentPropsWithoutRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/lib/classNames";`
    : `import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";`;

  return `${imports}

/**
 * ${componentName} コンポーネント
 *
 * ${component.description || "説明なし"}
 *
 * @figma ${component.nodeId}
 * @generated Figma API から自動生成 (${new Date().toISOString()})
 *
 * スタイルの適用:
 * - Text Styles は figma-styles.css の .text-{style-name} クラスを使用
 * - Color Styles は figma-theme.ts の色を使用 (bg-{colorName}, text-{colorName})
 * - Effect Styles は figma-theme.ts の shadow-{effectName} を使用
 */
${cvaSection}
${propsInterface}

${componentBody}
`;
}

async function main() {
  console.log("🎨 Figma コンポーネント生成開始");

  try {
    // JSONファイルを読み込み
    const inputPath = path.resolve(
      process.cwd(),
      "design-tokens/figma-components.json",
    );

    if (!fs.existsSync(inputPath)) {
      console.error("\n❌ figma-components.json が見つかりません");
      console.error(
        "   先に 'pnpm run figma:fetch:components' を実行してください",
      );
      process.exit(1);
    }

    const data: FigmaComponentsData = JSON.parse(
      fs.readFileSync(inputPath, "utf-8"),
    );

    console.log(
      `\n📦 ${data.componentDetails.length} 個のコンポーネントを処理します`,
    );

    // 出力ディレクトリ
    const outputDir = path.resolve(
      process.cwd(),
      "features/shared/figma_generated",
    );
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 各コンポーネントを生成
    let generatedCount = 0;
    for (const component of data.componentDetails) {
      const componentName = toPascalCase(component.name);
      const outputPath = path.join(outputDir, `${componentName}.tsx`);

      const code = generateComponentCode(component);
      fs.writeFileSync(outputPath, code);

      console.log(`   ✅ ${componentName}.tsx を生成`);
      generatedCount++;
    }

    console.log(`\n✨ ${generatedCount} 個のコンポーネントを生成しました`);
    console.log(`   出力先: ${outputDir}`);

    console.log("\n📝 次のステップ:");
    console.log("   1. 生成されたコンポーネントのスタイルを調整");
    console.log("   2. Figmaのデザインに合わせてclassNamesを更新");
    console.log("   3. 必要に応じて追加のpropsを定義");
  } catch (error) {
    console.error("\n❌ エラーが発生しました:");
    console.error(error);
    process.exit(1);
  }
}

main();
