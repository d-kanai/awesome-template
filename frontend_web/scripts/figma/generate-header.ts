/**
 * Header Component 生成スクリプト
 *
 * Figma Page JSONからHeaderを生成
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { HeaderGenerator } from "./component-generators/HeaderGenerator";

async function main() {
  console.log("🎨 Headerコンポーネントを生成します\n");

  const generator = new HeaderGenerator();
  const outputDir = path.resolve(
    process.cwd(),
    "features/shared/figma_generated",
  );
  const outputPath = path.join(outputDir, "Header.tsx");

  // Generatorを実行
  const { imports, interfaceCode, componentCode } = generator.generate(
    [], // ComponentInfoは今回使わない（Page JSONから直接読み込む）
    "Header",
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

  console.log("\n✅ Header.tsx を生成しました");
  console.log(`   出力先: ${outputPath}`);
}

main().catch((error) => {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
});
