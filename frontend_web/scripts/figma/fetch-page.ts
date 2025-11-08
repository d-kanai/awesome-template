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

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  [key: string]: any;
}

interface FigmaFileResponse {
  document: {
    children: FigmaNode[];
  };
}

/**
 * Figma REST API からファイル情報を取得
 */
async function fetchFigmaFile(): Promise<FigmaFileResponse> {
  const url = `${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}`;

  console.log(`📡 Fetching Figma file: ${FIGMA_FILE_KEY}`);

  const response = await fetch(url, {
    headers: {
      "X-Figma-Token": FIGMA_ACCESS_TOKEN!,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Figma API error: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * メイン処理
 */
async function main() {
  const pageName = process.argv[2] || "Examples";

  console.log(`\n🎨 Figma Page を取得します: ${pageName}\n`);

  try {
    const fileData = await fetchFigmaFile();

    // ページを探す
    const page = fileData.document.children.find(
      (child) => child.name === pageName,
    );

    if (!page) {
      console.error(`❌ ページが見つかりません: ${pageName}`);
      console.log("\n📋 利用可能なページ:");
      for (const child of fileData.document.children) {
        console.log(`   - ${child.name}`);
      }
      process.exit(1);
    }

    console.log(`✅ ページを見つけました: ${page.name}`);
    console.log(`   Type: ${page.type}`);
    console.log(`   Children: ${page.children?.length || 0}`);

    // 結果を保存
    const outputPath = path.resolve(
      process.cwd(),
      "design-tokens",
      `figma-page-${pageName.toLowerCase()}.json`,
    );

    const output = {
      pageName: page.name,
      pageId: page.id,
      pageType: page.type,
      fetchedAt: new Date().toISOString(),
      fileKey: FIGMA_FILE_KEY,
      data: page,
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`\n💾 保存しました: ${outputPath}`);
    console.log("\n📊 統計:");
    console.log(`   ページ名: ${page.name}`);
    console.log(`   子ノード数: ${page.children?.length || 0}`);

    if (page.children) {
      const nodeTypes = page.children.reduce(
        (acc, child) => {
          acc[child.type] = (acc[child.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      console.log("\n   ノードタイプ別:");
      for (const [type, count] of Object.entries(nodeTypes)) {
        console.log(`     ${type}: ${count}`);
      }
    }
  } catch (error) {
    console.error("\n❌ エラーが発生しました:");
    console.error(error);
    process.exit(1);
  }
}

main();
