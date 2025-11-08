import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "dotenv";

// .env.local を読み込み
config({ path: path.resolve(process.cwd(), ".env.local") });

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_ACCESS_TOKEN) {
  console.error("❌ FIGMA_ACCESS_TOKEN が設定されていません");
  process.exit(1);
}

if (!FIGMA_FILE_KEY) {
  console.error("❌ FIGMA_FILE_KEY が設定されていません");
  process.exit(1);
}

const FIGMA_API_BASE = "https://api.figma.com/v1";

async function fetchVariables() {
  const url = `${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/variables/local`;

  console.log("\n📡 Figma Variables API を呼び出しています...");
  console.log(`   URL: ${url}`);

  const response = await fetch(url, {
    headers: {
      "X-Figma-Token": FIGMA_ACCESS_TOKEN as string,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Figma API エラー: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

async function main() {
  console.log("🎨 Figma Variables 取得開始");
  console.log(`   File Key: ${FIGMA_FILE_KEY}`);

  try {
    const variables = await fetchVariables();

    console.log("\n✅ Variables 取得成功");
    console.log(
      `   Variable Collections: ${Object.keys(variables.meta?.variableCollections || {}).length} 個`,
    );
    console.log(
      `   Variables: ${Object.keys(variables.meta?.variables || {}).length} 個`,
    );

    // 出力ディレクトリ
    const rawDir = path.resolve(process.cwd(), "design-tokens/raw");
    if (!fs.existsSync(rawDir)) {
      fs.mkdirSync(rawDir, { recursive: true });
    }

    // 生データを保存
    const rawOutputPath = path.resolve(rawDir, "figma-variables-raw.json");
    fs.writeFileSync(rawOutputPath, JSON.stringify(variables, null, 2));

    console.log("\n💾 Variables情報を保存しました");
    console.log(`   Path: ${rawOutputPath}`);

    // Variable ID 9:11193 を探す
    const targetId = "VariableID:9:11193";
    const allVariables = variables.meta?.variables || {};

    for (const [varId, varData] of Object.entries(allVariables)) {
      if (varId === targetId) {
        console.log(`\n🔍 Found Variable ID ${targetId}:`);
        console.log(JSON.stringify(varData, null, 2));
      }
    }

    console.log("\n✨ 完了！");
  } catch (error) {
    console.error("\n❌ エラーが発生しました:");
    console.error(error);
    process.exit(1);
  }
}

main();
