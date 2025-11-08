import * as fs from "node:fs";
import * as path from "node:path";
import { findGenerator } from "./component-generators";
import type { ComponentInfo } from "./component-generators";

interface ComponentProperty {
  type: string;
  defaultValue: string | boolean;
  variantOptions?: string[];
}

interface FigmaComponentInfo {
  key: string;
  name: string;
  description: string;
  nodeId: string;
  type: string;
  properties: Record<string, ComponentProperty>;
  componentSetProperties?: Record<string, ComponentProperty>;
  variantProperties?: Record<string, string>;
  pageName?: string;
}

interface FigmaComponentsData {
  generatedAt: string;
  fileKey: string;
  componentDetails: FigmaComponentInfo[];
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s/=]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

/**
 * Figma ComponentInfo を Generator用の ComponentInfo に変換
 */
function toGeneratorComponentInfo(
  component: FigmaComponentInfo,
): ComponentInfo {
  return {
    id: component.key,
    name: component.name,
    componentSetName: component.pageName,
    componentSetProperties: component.componentSetProperties
      ? Object.fromEntries(
          Object.entries(component.componentSetProperties).map(
            ([key, prop]) => [
              key,
              {
                type: prop.type,
                defaultValue: String(prop.defaultValue),
              },
            ],
          ),
        )
      : undefined,
    variantProperties: component.variantProperties,
    description: component.description,
  };
}

/**
 * Component Set ごとにコンポーネントをグループ化
 */
function groupComponentsBySet(
  components: FigmaComponentInfo[],
): Map<string, FigmaComponentInfo[]> {
  const componentSets = new Map<string, FigmaComponentInfo[]>();

  for (const component of components) {
    // COMPONENT_SET はスキップ（個別のCOMPONENTのみ処理）
    if (component.type === "COMPONENT_SET") {
      continue;
    }

    // componentSetProperties がある = Component Set の一部
    if (component.componentSetProperties) {
      // pageName（親のCOMPONENT_SET名）をキーとして使用
      // pageName がない場合は、name の最初のセグメントを使用
      const setName = component.pageName || component.name.split(",")[0].trim();
      const existing = componentSets.get(setName) || [];
      existing.push(component);
      componentSets.set(setName, existing);
    }
  }

  return componentSets;
}

/**
 * コンポーネントセット名からファイル名を決定
 */
function determineComponentName(components: FigmaComponentInfo[]): string {
  if (components.length === 0) return "UnknownComponent";

  // Generator を使って名前を決定
  const generatorComponent = toGeneratorComponentInfo(components[0]);
  const generator = findGenerator(generatorComponent);

  if (generator?.getComponentName) {
    return generator.getComponentName([generatorComponent]);
  }

  // デフォルト: 最初のコンポーネント名から生成
  const baseName = components[0].name.split(",")[0].trim();
  return toPascalCase(baseName.replace(/^.*\/\s*/, "")); // "Button / Primary" -> "Primary"
}

/**
 * コンポーネントコードを生成
 */
function generateComponentFile(
  components: FigmaComponentInfo[],
  componentName: string,
): string | null {
  if (components.length === 0) return null;

  // Generator を探す
  const generatorComponents = components.map(toGeneratorComponentInfo);
  const generator = findGenerator(generatorComponents[0]);

  if (!generator) {
    console.log(
      `⚠️  Generator not found for: ${componentName} (skipping)`,
    );
    return null;
  }

  // Generator を使ってコードを生成
  const { imports, interfaceCode, componentCode } = generator.generate(
    generatorComponents,
    componentName,
  );

  return `${imports.join("\n")}

${interfaceCode}

${componentCode}
`;
}

/**
 * メイン処理
 */
async function main() {
  console.log("🎨 Figma Components からReactコンポーネントを生成します\n");

  const inputPath = path.resolve(
    process.cwd(),
    "design-tokens/figma-components.json",
  );
  const outputDir = path.resolve(
    process.cwd(),
    "features/shared/figma_generated",
  );

  // 入力ファイル読み込み
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ ファイルが見つかりません: ${inputPath}`);
    console.error(
      "   先に `pnpm run figma:fetch:components` を実行してください",
    );
    process.exit(1);
  }

  const data: FigmaComponentsData = JSON.parse(
    fs.readFileSync(inputPath, "utf-8"),
  );

  console.log(`📂 読み込んだコンポーネント数: ${data.componentDetails.length}`);

  // Component Set ごとにグループ化
  const componentSets = groupComponentsBySet(data.componentDetails);
  console.log(`📦 Component Set 数: ${componentSets.size}\n`);

  // 出力ディレクトリを準備
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let generatedCount = 0;
  let skippedCount = 0;

  // 各 Component Set を処理
  for (const [setName, components] of componentSets.entries()) {
    const componentName = determineComponentName(components);
    const code = generateComponentFile(components, componentName);

    if (!code) {
      skippedCount++;
      continue;
    }

    const outputPath = path.join(outputDir, `${componentName}.tsx`);
    fs.writeFileSync(outputPath, code);

    console.log(`✅ ${componentName}.tsx を生成しました (${components.length} variants)`);
    generatedCount++;
  }

  console.log(`\n✨ 生成完了！`);
  console.log(`   生成: ${generatedCount} コンポーネント`);
  console.log(`   スキップ: ${skippedCount} コンポーネント`);
  console.log(`   出力先: ${outputDir}`);
}

main();
