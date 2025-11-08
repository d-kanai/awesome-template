import * as fs from "node:fs";
import * as path from "node:path";

interface ComponentProperty {
  type: string;
  defaultValue: string | boolean;
  variantOptions?: string[];
  preferredValues?: Array<{
    type: string;
    key: string;
  }>;
}

interface ComponentInfo {
  key: string;
  name: string;
  description: string;
  nodeId: string;
  type: string;
  properties: Record<string, ComponentProperty>;
  componentSetProperties?: Record<string, ComponentProperty>;
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

/**
 * Figmaプロパティ名から #node_id サフィックスを削除
 * 例: "Icon Start#4:192" -> "Icon Start"
 */
function cleanPropertyName(propName: string): string {
  return propName.replace(/#\d+:\d+$/, "");
}

function generateVariantType(
  propName: string,
  prop: ComponentProperty,
): string {
  const cleanName = cleanPropertyName(propName);
  const camelName = toCamelCase(cleanName);

  if (prop.type === "VARIANT" && prop.variantOptions) {
    const options = prop.variantOptions.map((opt) => `"${opt}"`).join(" | ");
    return `${camelName}?: ${options};`;
  }
  if (prop.type === "BOOLEAN") {
    return `${camelName}?: boolean;`;
  }
  if (prop.type === "TEXT") {
    return `${camelName}?: string;`;
  }
  if (prop.type === "INSTANCE_SWAP") {
    // React.ReactNode for icon/component swapping
    return `${camelName}?: React.ReactNode;`;
  }
  return `${camelName}?: string;`;
}

function generateComponentCode(
  component: ComponentInfo,
  componentName?: string,
): string {
  const finalComponentName = componentName || toPascalCase(component.name);

  // componentSetProperties を優先して使用（COMPONENT_SET全体のプロパティ定義）
  const allProperties =
    component.componentSetProperties || component.properties;
  const hasVariants = Object.keys(allProperties).length > 0;

  // Icon Button パターンかどうか
  const isIconButton = isIconButtonPattern(component);
  // Input Field パターンかどうか
  const isInputField = isInputFieldPattern(component);

  // プロパティ定義
  let propsDefinition = Object.entries(allProperties)
    .filter(([name]) => {
      // Icon Buttonの場合、Iconプロパティは別処理
      if (isIconButton && name.startsWith("Icon#")) {
        return false;
      }
      return true;
    })
    .map(([name, prop]) => `  ${generateVariantType(name, prop)}`)
    .join("\n");

  // Icon Buttonの場合は icon prop (required) と aria-label を追加
  if (isIconButton) {
    propsDefinition += "\n  icon: React.ReactNode;";
    propsDefinition += '\n  "aria-label": string;';
  }

  const elementType = isIconButton ? "button" : isInputField ? "input" : "div";

  const propsInterface = propsDefinition
    ? `export interface ${finalComponentName}Props extends ComponentPropsWithoutRef<"${elementType}"> {
${propsDefinition}
}`
    : `export interface ${finalComponentName}Props extends ComponentPropsWithoutRef<"${elementType}"> {}`;

  // CVA variants定義
  const cvaVariants = Object.entries(allProperties)
    .filter(([_, prop]) => prop.type === "VARIANT" && prop.variantOptions)
    .map(([name, prop]) => {
      const variantName = toCamelCase(cleanPropertyName(name));
      const options = prop.variantOptions
        ?.map((opt) => `        ${toCamelCase(opt)}: "",`)
        .join("\n");
      return `      ${variantName}: {\n${options}\n      }`;
    })
    .join(",\n");

  const defaultVariants = Object.entries(allProperties)
    .filter(([_, prop]) => prop.type === "VARIANT")
    .map(([name, prop]) => {
      const variantName = toCamelCase(cleanPropertyName(name));
      const defaultValue =
        typeof prop.defaultValue === "string"
          ? toCamelCase(prop.defaultValue)
          : "undefined";
      return `      ${variantName}: "${defaultValue}"`;
    })
    .join(",\n");

  const cvaSection = hasVariants
    ? `
const ${toCamelCase(finalComponentName)}Variants = cva(
  "",
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
  const propDestructuring = Object.keys(allProperties)
    .filter((name) => {
      // Icon ButtonのIconプロパティは除外（別途iconとして処理）
      if (isIconButton && name.startsWith("Icon#")) {
        return false;
      }
      return true;
    })
    .map((name) => toCamelCase(cleanPropertyName(name)))
    .join(", ");

  let componentBody: string;
  if (isIconButton) {
    // Icon Button用の実装
    componentBody = `export function ${finalComponentName}({
  className,
  ${propDestructuring},
  icon,
  ...props
}: ${finalComponentName}Props) {
  return (
    <button
      className={cn(${toCamelCase(finalComponentName)}Variants({ ${propDestructuring}, className }))}
      {...props}
    >
      {icon}
    </button>
  );
}`;
  } else if (isInputField) {
    // Input Field用の実装（label, input, error, description を含む）
    componentBody = `export function ${finalComponentName}({
  className,
  ${propDestructuring},
  ...props
}: ${finalComponentName}Props) {
  const showError = state === "error" && hasError;
  const isDisabled = state === "disabled";

  return (
    <div className="space-y-1">
      {hasLabel && <label className="block text-sm font-medium">{label}</label>}
      <input
        className={cn(${toCamelCase(finalComponentName)}Variants({ ${propDestructuring}, className }))}
        placeholder={valueType === "placeholder" ? value : undefined}
        defaultValue={valueType === "default" ? value : undefined}
        disabled={isDisabled}
        aria-invalid={showError}
        aria-describedby={showError ? "error-message" : hasDescription ? "description" : undefined}
        {...props}
      />
      {hasDescription && <p id="description" className="text-sm text-muted-foreground">{description}</p>}
      {showError && <p id="error-message" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}`;
  } else if (hasVariants) {
    componentBody = `export function ${finalComponentName}({
  className,
  ${propDestructuring},
  children,
  ...props
}: ${finalComponentName}Props) {
  return (
    <div
      className={cn(${toCamelCase(finalComponentName)}Variants({ ${propDestructuring}, className }))}
      {...props}
    >
      {children}
    </div>
  );
}`;
  } else {
    componentBody = `export function ${finalComponentName}({
  className,
  children,
  ...props
}: ${finalComponentName}Props) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}`;
  }

  const imports = hasVariants
    ? `import type { ComponentPropsWithoutRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/features/shared/lib/classNames";`
    : `import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/features/shared/lib/classNames";`;

  // Icon Button の場合は説明文を追加
  const componentDescription = isIconButton
    ? "アイコンのみを表示する正方形ボタン"
    : component.description || "説明なし";

  return `${imports}

/**
 * ${finalComponentName} コンポーネント
 *
 * ${componentDescription}
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

/**
 * コンポーネントをCOMPONENT_SETごとにグループ化
 */
function groupComponentsBySet(
  components: ComponentInfo[],
): Map<string, ComponentInfo[]> {
  const groups = new Map<string, ComponentInfo[]>();

  for (const component of components) {
    // componentSetProperties のキーをソートして一意なIDを作成
    const propKeys = Object.keys(component.componentSetProperties || {}).sort();
    const groupKey = propKeys.join("|");

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)?.push(component);
  }

  return groups;
}

/**
 * Icon Button パターンを検出
 * Icon#4:192, Size, State, Variant の4プロパティのみ持つ
 */
function isIconButtonPattern(component: ComponentInfo): boolean {
  const props = component.componentSetProperties || {};
  const keys = Object.keys(props).sort();

  return (
    keys.length === 4 &&
    keys.includes("Size") &&
    keys.includes("State") &&
    keys.includes("Variant") &&
    keys.some((key) => key.startsWith("Icon#"))
  );
}

/**
 * Input Field パターンを検出
 * State, Value Type, Has Label, Label, Error, Value, Description, Has Description, Has Error, Open の10プロパティ持つ
 */
function isInputFieldPattern(component: ComponentInfo): boolean {
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

/**
 * グループから代表的なコンポーネント名を決定
 */
function determineComponentSetName(components: ComponentInfo[]): string {
  if (components.length === 0) return "UnknownComponent";

  // Icon Buttonパターンの場合
  if (isIconButtonPattern(components[0])) {
    return "IconButton";
  }

  // Input Fieldパターンの場合
  if (isInputFieldPattern(components[0])) {
    return "InputField";
  }

  // それ以外は最初のコンポーネント名から推測
  // "Variant=Primary, State=Default, Size=Medium" -> "Button"
  const firstName = components[0].name;
  if (firstName.includes("Variant=") && firstName.includes("State=")) {
    // バリアント名から推測できない場合は、プロパティから推測
    const props = components[0].componentSetProperties || {};
    if (props["Label#2:0"]) {
      return "ButtonNew";
    }
  }

  return toPascalCase(firstName);
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

    // COMPONENT_SETごとにグループ化
    const componentGroups = groupComponentsBySet(data.componentDetails);
    console.log(`\n🔍 ${componentGroups.size} 個のCOMPONENT_SETを検出`);

    // 出力ディレクトリ
    const outputDir = path.resolve(
      process.cwd(),
      "features/shared/figma_generated",
    );
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 各COMPONENT_SETごとに1つのコンポーネントを生成
    let generatedCount = 0;
    for (const [groupKey, components] of componentGroups.entries()) {
      // 代表的なコンポーネントを使用
      const representative = components[0];
      const componentName = determineComponentSetName(components);

      console.log(
        `\n   ${componentName}: ${components.length} variants (${groupKey.split("|").join(", ")})`,
      );

      const outputPath = path.join(outputDir, `${componentName}.tsx`);

      const code = generateComponentCode(representative, componentName);
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
