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

interface FigmaStyle {
  key: string;
  name: string;
  description: string;
  style_type: "FILL" | "TEXT" | "EFFECT" | "GRID";
  node_id: string;
}

interface FigmaFileStylesResponse {
  meta: {
    styles: FigmaStyle[];
  };
}

interface FigmaTextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeightPx?: number;
  lineHeightPercent?: number;
  letterSpacing?: number;
  textAlignHorizontal?: string;
}

interface FigmaColorFill {
  type: string;
  color?: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}

interface FigmaEffect {
  type: string;
  visible: boolean;
  radius?: number;
  color?: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  offset?: {
    x: number;
    y: number;
  };
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  style?: FigmaTextStyle;
  fills?: FigmaColorFill[];
  effects?: FigmaEffect[];
}

interface FigmaNodesResponse {
  nodes: Record<
    string,
    {
      document: FigmaNode;
    }
  >;
}

interface TextStyleInfo {
  key: string;
  name: string;
  description: string;
  nodeId: string;
  style: FigmaTextStyle;
}

interface ColorStyleInfo {
  key: string;
  name: string;
  description: string;
  nodeId: string;
  color: string;
}

interface EffectStyleInfo {
  key: string;
  name: string;
  description: string;
  nodeId: string;
  effects: FigmaEffect[];
}

async function fetchFigmaStyles(): Promise<FigmaFileStylesResponse> {
  const url = `${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/styles`;

  console.log("\n📡 Figma Styles API を呼び出しています...");
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
  const url = `${FIGMA_API_BASE}/files/${FIGMA_FILE_KEY}/nodes?ids=${ids}`;

  console.log("\n📡 Figma Nodes API を呼び出しています...");
  console.log(`   Node IDs: ${nodeIds.length} 個`);

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

function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const toHex = (value: number) =>
    Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");

  if (a < 1) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function extractTextStyle(
  style: FigmaStyle,
  node: FigmaNode,
): TextStyleInfo | null {
  if (style.style_type !== "TEXT" || !node.style) {
    return null;
  }

  return {
    key: style.key,
    name: style.name,
    description: style.description,
    nodeId: node.id,
    style: node.style,
  };
}

function extractColorStyle(
  style: FigmaStyle,
  node: FigmaNode,
): ColorStyleInfo | null {
  if (style.style_type !== "FILL" || !node.fills || node.fills.length === 0) {
    return null;
  }

  const fill = node.fills[0];
  if (!fill.color) {
    return null;
  }

  return {
    key: style.key,
    name: style.name,
    description: style.description,
    nodeId: node.id,
    color: rgbaToHex(fill.color.r, fill.color.g, fill.color.b, fill.color.a),
  };
}

function extractEffectStyle(
  style: FigmaStyle,
  node: FigmaNode,
): EffectStyleInfo | null {
  if (style.style_type !== "EFFECT" || !node.effects) {
    return null;
  }

  return {
    key: style.key,
    name: style.name,
    description: style.description,
    nodeId: node.id,
    effects: node.effects,
  };
}

async function main() {
  console.log("🎨 Figma Styles 取得開始");
  console.log(`   File Key: ${FIGMA_FILE_KEY}`);

  try {
    // Styles 一覧を取得
    const stylesResponse = await fetchFigmaStyles();
    const styles = stylesResponse.meta.styles;
    console.log(`\n✅ Styles 取得成功: ${styles.length} 個`);

    // スタイルタイプごとに分類
    const textStyles = styles.filter((s) => s.style_type === "TEXT");
    const colorStyles = styles.filter((s) => s.style_type === "FILL");
    const effectStyles = styles.filter((s) => s.style_type === "EFFECT");

    console.log(`\n📊 スタイル分類:`);
    console.log(`   Text Styles: ${textStyles.length} 個`);
    console.log(`   Color Styles: ${colorStyles.length} 個`);
    console.log(`   Effect Styles: ${effectStyles.length} 個`);

    // ノードIDを抽出
    const nodeIds = styles.map((s) => s.node_id);

    // ノードの詳細情報を取得
    const nodesResponse = await fetchFigmaNodes(nodeIds);
    console.log(
      `\n✅ Nodes 取得成功: ${Object.keys(nodesResponse.nodes).length} 個`,
    );

    // スタイル情報を抽出
    const textStyleInfos: TextStyleInfo[] = [];
    const colorStyleInfos: ColorStyleInfo[] = [];
    const effectStyleInfos: EffectStyleInfo[] = [];

    for (const style of styles) {
      const node = nodesResponse.nodes[style.node_id]?.document;
      if (!node) continue;

      if (style.style_type === "TEXT") {
        const info = extractTextStyle(style, node);
        if (info) textStyleInfos.push(info);
      } else if (style.style_type === "FILL") {
        const info = extractColorStyle(style, node);
        if (info) colorStyleInfos.push(info);
      } else if (style.style_type === "EFFECT") {
        const info = extractEffectStyle(style, node);
        if (info) effectStyleInfos.push(info);
      }
    }

    // 処理済みデータを保存
    const outputPath = path.resolve(
      process.cwd(),
      "design-tokens/figma-styles.json",
    );
    fs.writeFileSync(
      outputPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          fileKey: FIGMA_FILE_KEY,
          textStyles: textStyleInfos,
          colorStyles: colorStyleInfos,
          effectStyles: effectStyleInfos,
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
    const rawOutputPath = path.resolve(rawDir, "figma-styles-raw.json");
    fs.writeFileSync(
      rawOutputPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          fileKey: FIGMA_FILE_KEY,
          stylesResponse: stylesResponse,
          nodesResponse: nodesResponse,
        },
        null,
        2,
      ),
    );
    console.log(`   生データ: ${rawOutputPath}`);

    console.log("\n💾 スタイル情報を保存しました");
    console.log(`   Path: ${outputPath}`);
    console.log("\n📝 取得したスタイル:");
    console.log(`   Text Styles: ${textStyleInfos.length} 個`);
    console.log(`   Color Styles: ${colorStyleInfos.length} 個`);
    console.log(`   Effect Styles: ${effectStyleInfos.length} 個`);

    if (textStyleInfos.length > 0) {
      console.log("\n📄 Text Styles:");
      for (const info of textStyleInfos.slice(0, 5)) {
        console.log(
          `   - ${info.name} (${info.style.fontFamily} ${info.style.fontSize}px)`,
        );
      }
    }

    if (colorStyleInfos.length > 0) {
      console.log("\n🎨 Color Styles:");
      for (const info of colorStyleInfos.slice(0, 5)) {
        console.log(`   - ${info.name} (${info.color})`);
      }
    }

    console.log(
      "\n✨ 完了！次は 'pnpm run figma:generate:styles' を実行してください",
    );
  } catch (error) {
    console.error("\n❌ エラーが発生しました:");
    console.error(error);
    process.exit(1);
  }
}

main();
