import * as fs from "node:fs";
import * as path from "node:path";

interface RawTokensFile {
  generatedAt: string;
  fileKey: string;
  tokens: {
    colors?: Record<string, string>;
    spacing?: Record<string, string>;
    fontSize?: Record<string, string>;
    fontWeight?: Record<string, string>;
    lineHeight?: Record<string, string>;
  };
}

function generateTailwindTokens(rawTokens: RawTokensFile): string {
  const { tokens } = rawTokens;

  return `/**
 * Figma デザイントークン (自動生成)
 *
 * @generated このファイルは自動生成されています。直接編集しないでください。
 * @see scripts/figma/generate-tokens.ts
 *
 * Generated at: ${rawTokens.generatedAt}
 * Figma File: https://figma.com/file/${rawTokens.fileKey}
 */

export const figmaTokens = {
  colors: ${JSON.stringify(tokens.colors || {}, null, 4)},
  spacing: ${JSON.stringify(tokens.spacing || {}, null, 4)},
  fontSize: ${JSON.stringify(tokens.fontSize || {}, null, 4)},
  fontWeight: ${JSON.stringify(tokens.fontWeight || {}, null, 4)},
  lineHeight: ${JSON.stringify(tokens.lineHeight || {}, null, 4)},
} as const;
`;
}

async function main() {
  console.log("🔧 Tailwind トークンファイルを生成中...");

  const inputPath = path.resolve(process.cwd(), "design-tokens/figma-raw.json");
  const outputPath = path.resolve(
    process.cwd(),
    "design-tokens/tailwind-tokens.ts",
  );

  // ファイルの存在確認
  if (!fs.existsSync(inputPath)) {
    console.error(`\n❌ ${inputPath} が見つかりません`);
    console.error("   先に 'pnpm run figma:fetch' を実行してください");
    process.exit(1);
  }

  // JSON を読み込み
  const rawTokens: RawTokensFile = JSON.parse(
    fs.readFileSync(inputPath, "utf-8"),
  );

  // TypeScript ファイルを生成
  const content = generateTailwindTokens(rawTokens);
  fs.writeFileSync(outputPath, content);

  console.log("\n✅ Tailwind トークンファイルを生成しました");
  console.log(`   Path: ${outputPath}`);
  console.log(
    "\n💡 次は tailwind.config.ts で以下のようにインポートしてください:",
  );
  console.log(
    `\n   import { figmaTokens } from './design-tokens/tailwind-tokens';`,
  );
  console.log("\n   export default {");
  console.log("     theme: {");
  console.log("       extend: {");
  console.log("         colors: figmaTokens.colors,");
  console.log("         spacing: figmaTokens.spacing,");
  console.log("         // ...");
  console.log("       },");
  console.log("     },");
  console.log("   }");
}

main();
