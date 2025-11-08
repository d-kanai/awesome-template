import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "dotenv";

// .env.local を読み込み
config({ path: path.resolve(process.cwd(), ".env.local") });

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_ACCESS_TOKEN) {
  console.error("❌ FIGMA_ACCESS_TOKEN が設定されていません");
  console.error(
    "   .env.local に FIGMA_ACCESS_TOKEN=your_token を追加してください",
  );
  process.exit(1);
}

if (!FIGMA_FILE_KEY) {
  console.error("❌ FIGMA_FILE_KEY が設定されていません");
  console.error(
    "   .env.local に FIGMA_FILE_KEY=your_file_key を追加してください",
  );
  process.exit(1);
}

const FIGMA_API_BASE = "https://api.figma.com/v1";

interface FigmaComponent {
  key: string;
  name: string;
  description: string;
  node_id: string;
  component_set_id?: string;
  containing_frame?: {
    nodeId: string;
    name: string;
    pageName: string;
  };
}

interface FigmaComponentsResponse {
  meta: {
    components: FigmaComponent[];
  };
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  parent?: {
    id: string;
    type: string;
  };
  componentProperties?: Record<
    string,
    {
      type: string;
      defaultValue: string | boolean;
      variantOptions?: string[];
    }
  >;
  children?: FigmaNode[];
  // Style information
  style?: {
    fontFamily?: string;
    fontWeight?: number;
    fontSize?: number;
    lineHeightPx?: number;
    letterSpacing?: number;
    textAlignHorizontal?: string;
    textAlignVertical?: string;
  };
  fills?: Array<{
    type: string;
    color?: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
    opacity?: number;
    boundVariables?: {
      color?: {
        type: string;
        id: string;
      };
    };
  }>;
  strokes?: Array<{
    type: string;
    color?: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
    opacity?: number;
    boundVariables?: {
      color?: {
        type: string;
        id: string;
      };
    };
  }>;
  effects?: Array<any>;
  // Border radius
  cornerRadius?: number;
  rectangleCornerRadii?: [number, number, number, number];
  // Border radius variable binding
  boundVariables?: {
    topLeftRadius?: {
      type: string;
      id: string;
    };
    topRightRadius?: {
      type: string;
      id: string;
    };
    bottomLeftRadius?: {
      type: string;
      id: string;
    };
    bottomRightRadius?: {
      type: string;
      id: string;
    };
  };
  // Style references (Figma Style IDs)
  styles?: {
    fill?: string;
    stroke?: string;
    text?: string;
    effect?: string;
  };
}

interface FigmaNodesResponse {
  nodes: Record<
    string,
    {
      document: FigmaNode;
    }
  >;
}

interface FigmaFileResponse {
  document: FigmaNode;
  components: Record<string, FigmaComponent>;
  componentSets: Record<
    string,
    {
      key: string;
      name: string;
      description: string;
      node_id: string;
    }
  >;
}

async function fetchFigmaComponents(): Promise<FigmaComponentsResponse> {
  const url = `${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/components`;

  console.log("\n📡 Figma Components API を呼び出しています...");
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

async function fetchFigmaNodes(nodeIds: string[]): Promise<FigmaNodesResponse> {
  const ids = nodeIds.join(",");
  // depth=2 で子ノードも取得（TEXTノードなどのstyle情報を含む）
  const url = `${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/nodes?ids=${ids}&depth=2`;

  console.log("\n📡 Figma Nodes API を呼び出しています...");
  console.log(`   Node IDs: ${nodeIds.length} 個 (depth=2)`);

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

async function fetchFigmaFile(): Promise<FigmaFileResponse> {
  const url = `${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}`;

  console.log(
    "\n📡 Figma File API を呼び出しています（COMPONENT_SET取得用）...",
  );
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

function findStyleReferences(node: FigmaNode): {
  textStyles: Set<string>;
  fillStyles: Set<string>;
  effectStyles: Set<string>;
} {
  const textStyles = new Set<string>();
  const fillStyles = new Set<string>();
  const effectStyles = new Set<string>();

  function traverse(n: FigmaNode) {
    // Figma Style IDsを収集
    if (n.styles) {
      if (n.styles.text) textStyles.add(n.styles.text);
      if (n.styles.fill) fillStyles.add(n.styles.fill);
      if (n.styles.effect) effectStyles.add(n.styles.effect);
    }

    // 子ノードを再帰的に探索
    if (n.children) {
      for (const child of n.children) {
        traverse(child);
      }
    }
  }

  traverse(node);
  return { textStyles, fillStyles, effectStyles };
}

function extractComponentInfo(
  component: FigmaComponent,
  node: FigmaNode,
  componentSetProperties?: Record<string, any>,
) {
  // 子ノードからFigma Style参照を抽出
  const styleRefs = findStyleReferences(node);

  return {
    key: component.key,
    name: component.name,
    description: component.description,
    nodeId: node.id,
    type: node.type,
    properties: node.componentProperties || {},
    componentSetProperties: componentSetProperties || {},
    pageName: component.containing_frame?.pageName,
    // Style information
    styleInfo: {
      textStyle: node.style,
      fills: node.fills,
      strokes: node.strokes,
      effects: node.effects,
      styleReferences: node.styles, // コンポーネント自体のStyle ID
      // 子ノードから収集したFigma Style IDs
      usedStyles: {
        textStyles: Array.from(styleRefs.textStyles),
        fillStyles: Array.from(styleRefs.fillStyles),
        effectStyles: Array.from(styleRefs.effectStyles),
      },
      // Border radius information
      cornerRadius: node.cornerRadius,
      rectangleCornerRadii: node.rectangleCornerRadii,
      boundVariables: node.boundVariables,
    },
  };
}

function findComponentSets(
  node: FigmaNode,
  componentSets: Map<string, any> = new Map(),
  variantToSetMap: Map<string, string> = new Map(),
): { componentSets: Map<string, any>; variantToSetMap: Map<string, string> } {
  // COMPONENT_SET型のノードを探す
  if (node.type === "COMPONENT_SET") {
    const setInfo = {
      id: node.id,
      name: node.name,
      componentPropertyDefinitions:
        (node as any).componentPropertyDefinitions || {},
    };
    componentSets.set(node.id, setInfo);

    // このCOMPONENT_SETの子ノード（バリアント）をマッピング
    if (node.children) {
      for (const child of node.children) {
        if (child.type === "COMPONENT") {
          variantToSetMap.set(child.id, node.id);
        }
      }
    }
  }

  // 子ノードを再帰的に探索
  if (node.children) {
    for (const child of node.children) {
      findComponentSets(child, componentSets, variantToSetMap);
    }
  }

  return { componentSets, variantToSetMap };
}

async function main() {
  console.log("🎨 Figma コンポーネント取得開始");
  console.log(`   File Key: ${FIGMA_FILE_KEY}`);

  try {
    // まず、ファイル全体を取得してCOMPONENT_SETを探す
    const fileResponse = await fetchFigmaFile();
    const { componentSets: componentSetMap, variantToSetMap } =
      findComponentSets(fileResponse.document);
    console.log(`\n✅ COMPONENT_SET 発見: ${componentSetMap.size} 個`);
    console.log(`✅ Variant → Set マッピング: ${variantToSetMap.size} 個`);

    // デバッグ: 最初のいくつかのCOMPONENT_SETを表示
    let count = 0;
    for (const [id, set] of componentSetMap.entries()) {
      if (count < 3) {
        console.log(`\n   例: ${set.name}`);
        console.log(`   - ID: ${id}`);
        const propCount = Object.keys(set.componentPropertyDefinitions).length;
        console.log(`   - Properties: ${propCount} 個`);
        if (propCount > 0) {
          console.log(
            `   - Property Keys: ${Object.keys(set.componentPropertyDefinitions).join(", ")}`,
          );
        }
        count++;
      }
    }

    // コンポーネント一覧を取得
    const componentsResponse = await fetchFigmaComponents();
    const components = componentsResponse.meta.components;
    console.log(`\n✅ Components 取得成功: ${components.length} 個`);

    // コンポーネントセットでグループ化
    const componentSets = new Map<string, FigmaComponent[]>();
    const standaloneComponents: FigmaComponent[] = [];

    for (const component of components) {
      if (component.component_set_id) {
        const setId = component.component_set_id;
        if (!componentSets.has(setId)) {
          componentSets.set(setId, []);
        }
        componentSets.get(setId)?.push(component);
      } else {
        standaloneComponents.push(component);
      }
    }

    console.log("\n📊 コンポーネント分類:");
    console.log(`   Component Sets: ${componentSets.size} 個`);
    console.log(`   Standalone Components: ${standaloneComponents.length} 個`);

    // Figma Nodes APIは一度に多数のノードを取得可能
    // バッチサイズを100に設定（API制限内）
    const BATCH_SIZE = 100;
    const allComponentInfos: any[] = [];

    console.log("\n📡 Figma Nodes API を呼び出しています...");
    console.log(`   Total: ${components.length} 個`);
    console.log(`   Batch size: ${BATCH_SIZE}`);

    // バッチ処理で全コンポーネントを取得
    for (let i = 0; i < components.length; i += BATCH_SIZE) {
      const batch = components.slice(i, i + BATCH_SIZE);
      const nodeIds = batch.map((c) => c.node_id);

      console.log(
        `   Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(components.length / BATCH_SIZE)}: ${nodeIds.length} 個`,
      );

      const nodesResponse = await fetchFigmaNodes(nodeIds);

      // このバッチのコンポーネント情報を抽出
      const batchInfos = batch
        .map((component) => {
          const node = nodesResponse.nodes[component.node_id]?.document;
          if (!node) return null;

          // このコンポーネントが属するCOMPONENT_SETのプロパティ定義を探す
          const componentSetId = variantToSetMap.get(node.id);
          const componentSetProperties = componentSetId
            ? componentSetMap.get(componentSetId)?.componentPropertyDefinitions
            : undefined;

          return extractComponentInfo(component, node, componentSetProperties);
        })
        .filter(Boolean);

      allComponentInfos.push(...batchInfos);

      // API rate limit対策: バッチ間で少し待機
      if (i + BATCH_SIZE < components.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    console.log(`\n✅ 全 Nodes 取得完了: ${allComponentInfos.length} 個`);
    const componentInfos = allComponentInfos;

    // 処理済みデータを保存
    const outputPath = path.resolve(
      process.cwd(),
      "design-tokens/figma-components.json",
    );
    fs.writeFileSync(
      outputPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          fileKey: FIGMA_FILE_KEY,
          componentSets: Array.from(componentSets.entries()).map(
            ([setId, components]) => ({
              setId,
              components: components.map((c) => c.name),
            }),
          ),
          standaloneComponents: standaloneComponents.map((c) => c.name),
          componentDetails: componentInfos,
        },
        null,
        2,
      ),
    );

    // 生データも保存（差分比較用）
    const rawDir = path.resolve(process.cwd(), "design-tokens/raw");
    if (!fs.existsSync(rawDir)) {
      fs.mkdirSync(rawDir, { recursive: true });
    }
    const rawOutputPath = path.resolve(rawDir, "figma-components-raw.json");
    fs.writeFileSync(
      rawOutputPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          fileKey: FIGMA_FILE_KEY,
          componentsResponse: componentsResponse,
          componentInfos: allComponentInfos,
        },
        null,
        2,
      ),
    );
    console.log(`   生データ: ${rawOutputPath}`);

    console.log("\n💾 コンポーネント情報を保存しました");
    console.log(`   Path: ${outputPath}`);
    console.log("\n📋 取得したコンポーネント:");
    for (const info of componentInfos) {
      console.log(`   - ${info.name} (${info.type})`);
      const propCount = Object.keys(info.properties).length;
      if (propCount > 0) {
        console.log(`     Properties: ${propCount} 個`);
      }
    }

    console.log(
      "\n✨ 完了！次は 'pnpm run figma:generate:components' を実行してください",
    );
  } catch (error) {
    console.error("\n❌ エラーが発生しました:");
    console.error(error);
    process.exit(1);
  }
}

main();
