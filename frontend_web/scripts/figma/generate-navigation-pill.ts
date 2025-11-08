/**
 * Navigation Pill Component 生成スクリプト
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { NavigationPillGenerator } from "./component-generators/NavigationPillGenerator";

async function main() {
  console.log("🎨 Navigation Pillコンポーネントを生成します\n");

  const generator = new NavigationPillGenerator();
  const outputDir = path.resolve(
    process.cwd(),
    "features/shared/figma_generated",
  );
  const outputPath = path.join(outputDir, "NavigationPill.tsx");

  // Generatorを実行
  const { imports, interfaceCode, componentCode } = generator.generate(
    [],
    "NavigationPill",
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

  console.log("\n✅ NavigationPill.tsx を生成しました");
  console.log(`   出力先: ${outputPath}`);
}

main().catch((error) => {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
});
