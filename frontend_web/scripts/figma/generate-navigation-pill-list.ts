/**
 * Navigation Pill List Component 生成スクリプト
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { NavigationPillListGenerator } from "./component-generators/NavigationPillListGenerator";

async function main() {
  console.log("🎨 Navigation Pill Listコンポーネントを生成します\n");

  const generator = new NavigationPillListGenerator();
  const outputDir = path.resolve(
    process.cwd(),
    "features/shared/figma_generated",
  );
  const outputPath = path.join(outputDir, "NavigationPillList.tsx");

  // Generatorを実行
  const { imports, interfaceCode, componentCode } = generator.generate(
    [],
    "NavigationPillList",
  );

  // コードを生成
  const code = `${imports.join("\n")}

${interfaceCode}

${componentCode}
`;

  // ファイルに書き込み
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, code);

  console.log("\n✅ NavigationPillList.tsx を生成しました");
  console.log(`   出力先: ${outputPath}`);
}

main().catch((error) => {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
});
