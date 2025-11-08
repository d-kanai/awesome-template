/**
 * Fetch all COMPONENT_SETs from a specific page
 *
 * ページ内のすべてのCOMPONENT_SETを抽出してコンポーネントリストに追加
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const FIGMA_API_BASE = "https://api.figma.com/v1";

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  componentSetProperties?: Record<string, any>;
  children?: FigmaNode[];
  [key: string]: any;
}

/**
 * COMPONENT_SETを再帰的に探索
 */
function findComponentSets(
  node: FigmaNode,
  sets: FigmaNode[] = [],
): FigmaNode[] {
  if (node.type === "COMPONENT_SET") {
    sets.push(node);
  }

  if (node.children) {
    for (const child of node.children) {
      findComponentSets(child, sets);
    }
  }

  return sets;
}

/**
 * COMPONENT_SETの詳細情報を取得
 */
async function fetchComponentSetDetails(nodeId: string): Promise<any> {
  const url = `${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/nodes?ids=${nodeId}&depth=1`;

  const response = await fetch(url, {
    headers: { "X-Figma-Token": FIGMA_ACCESS_TOKEN! },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch node: ${response.statusText}`);
  }

  const data = await response.json();
  return data.nodes[nodeId];
}

async function main() {
  const pageName = process.argv[2] || "Sections";

  console.log(`\n🔍 ${pageName} ページからコンポーネントを取得します\n`);

  // ページデータを読み込み
  const pageFile = path.resolve(
    process.cwd(),
    `design-tokens/figma-page-${pageName.toLowerCase()}.json`,
  );

  if (!fs.existsSync(pageFile)) {
    console.error(`❌ ページファイルが見つかりません: ${pageFile}`);
    console.error("   先に以下のコマンドを実行してください:");
    console.error(`   pnpm exec tsx scripts/figma/fetch-page.ts ${pageName}`);
    process.exit(1);
  }

  const pageData = JSON.parse(fs.readFileSync(pageFile, "utf-8"));

  // COMPONENT_SETを探索
  const componentSets = findComponentSets(pageData.data);
  console.log(`📦 見つかったCOMPONENT_SET: ${componentSets.length}個\n`);

  const componentDetails: any[] = [];

  for (const componentSet of componentSets) {
    console.log(`   処理中: ${componentSet.name} (${componentSet.id})`);

    try {
      // 詳細情報を取得
      const details = await fetchComponentSetDetails(componentSet.id);

      componentDetails.push({
        key: componentSet.id,
        name: componentSet.name,
        description: componentSet.description || "",
        nodeId: componentSet.id,
        type: "COMPONENT_SET",
        componentSetProperties: componentSet.componentSetProperties || {},
        pageName: pageName,
      });

      // レート制限対策
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`   ⚠️  取得失敗: ${componentSet.name}`);
    }
  }

  // 保存
  const outputPath = path.resolve(
    process.cwd(),
    `design-tokens/figma-${pageName.toLowerCase()}-components.json`,
  );

  const output = {
    generatedAt: new Date().toISOString(),
    fileKey: FIGMA_FILE_KEY,
    pageName,
    componentDetails,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log("\n✅ 完了！");
  console.log(`   コンポーネント数: ${componentDetails.length}`);
  console.log(`   保存先: ${outputPath}`);
  console.log("\n📋 コンポーネント一覧:");
  for (const component of componentDetails) {
    const propCount = Object.keys(
      component.componentSetProperties || {},
    ).length;
    console.log(`   - ${component.name} (${propCount} properties)`);
  }
}

main();
