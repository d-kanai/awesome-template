import * as fs from "node:fs";
import * as path from "node:path";

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  componentId?: string;
  componentProperties?: Record<string, any>;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  [key: string]: any;
}

/**
 * ノードツリーを再帰的に表示
 */
function printNodeTree(node: FigmaNode, indent = 0, showDetails = false): void {
  const prefix = "  ".repeat(indent);
  const icon = getNodeIcon(node.type);

  let line = `${prefix}${icon} ${node.name}`;

  if (showDetails) {
    line += ` [${node.type}]`;

    if (node.componentId) {
      line += ` 📎 ${node.componentId}`;
    }

    if (node.absoluteBoundingBox) {
      const box = node.absoluteBoundingBox;
      line += ` 📐 ${Math.round(box.width)}x${Math.round(box.height)}`;
    }

    if (node.componentProperties) {
      const props = Object.entries(node.componentProperties)
        .map(([key, value]: [string, any]) => `${key}=${value.value}`)
        .join(", ");
      if (props) {
        line += ` {${props}}`;
      }
    }
  }

  console.log(line);

  if (node.children) {
    for (const child of node.children) {
      printNodeTree(child, indent + 1, showDetails);
    }
  }
}

/**
 * ノードタイプに応じたアイコンを返す
 */
function getNodeIcon(type: string): string {
  const icons: Record<string, string> = {
    COMPONENT: "🧩",
    COMPONENT_SET: "📦",
    INSTANCE: "🔗",
    FRAME: "🖼️",
    TEXT: "📝",
    RECTANGLE: "▭",
    VECTOR: "✏️",
    GROUP: "📁",
    SECTION: "📂",
    CANVAS: "🎨",
  };
  return icons[type] || "◦";
}

/**
 * コンポーネント内で使われているINSTANCEを収集
 */
function collectInstances(node: FigmaNode): Array<{
  name: string;
  componentId: string;
  path: string;
}> {
  const instances: Array<{ name: string; componentId: string; path: string }> =
    [];

  function traverse(n: FigmaNode, path: string) {
    if (n.type === "INSTANCE" && n.componentId) {
      instances.push({
        name: n.name,
        componentId: n.componentId,
        path,
      });
    }

    if (n.children) {
      for (const child of n.children) {
        traverse(child, `${path} > ${child.name}`);
      }
    }
  }

  traverse(node, node.name);
  return instances;
}

/**
 * メイン処理
 */
function main() {
  const componentName = process.argv[2];
  const pageName = process.argv[3] || "Sections";

  if (!componentName) {
    console.error("❌ コンポーネント名を指定してください");
    console.error("   例: tsx analyze-component-tree.ts Header Sections");
    process.exit(1);
  }

  console.log(`\n🔍 ${componentName} コンポーネントの構造を解析します\n`);

  // ページデータを読み込み
  const pageFile = path.resolve(
    process.cwd(),
    "design-tokens",
    `figma-page-${pageName.toLowerCase()}.json`,
  );

  if (!fs.existsSync(pageFile)) {
    console.error(`❌ ページファイルが見つかりません: ${pageFile}`);
    console.error("   先に以下のコマンドを実行してください:");
    console.error(`   pnpm exec tsx scripts/figma/fetch-page.ts ${pageName}`);
    process.exit(1);
  }

  const pageData = JSON.parse(fs.readFileSync(pageFile, "utf-8"));

  // コンポーネントを探す
  let targetComponent: FigmaNode | null = null;

  function findComponent(node: FigmaNode): FigmaNode | null {
    if (node.name === componentName && node.type === "COMPONENT_SET") {
      return node;
    }

    if (node.children) {
      for (const child of node.children) {
        const found = findComponent(child);
        if (found) return found;
      }
    }

    return null;
  }

  targetComponent = findComponent(pageData.data);

  if (!targetComponent) {
    console.error(`❌ コンポーネントが見つかりません: ${componentName}`);
    process.exit(1);
  }

  console.log(`✅ コンポーネントを見つけました: ${targetComponent.name}`);
  console.log(`   タイプ: ${targetComponent.type}`);
  console.log(`   バリアント数: ${targetComponent.children?.length || 0}\n`);

  // 各バリアントの構造を表示
  if (targetComponent.children) {
    for (let i = 0; i < targetComponent.children.length; i++) {
      const variant = targetComponent.children[i];

      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📋 バリアント ${i + 1}: ${variant.name}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      printNodeTree(variant, 0, true);

      // このバリアントで使われているインスタンスを収集
      const instances = collectInstances(variant);

      if (instances.length > 0) {
        console.log(
          `\n📌 使用されているコンポーネントインスタンス (${instances.length}個):`,
        );

        const uniqueComponents = new Map<
          string,
          { name: string; count: number }
        >();

        for (const instance of instances) {
          const existing = uniqueComponents.get(instance.componentId);
          if (existing) {
            existing.count++;
          } else {
            uniqueComponents.set(instance.componentId, {
              name: instance.name,
              count: 1,
            });
          }
        }

        for (const [componentId, info] of uniqueComponents.entries()) {
          console.log(`   🔗 ${info.name} (${componentId}) x${info.count}`);
        }
      }
    }
  }

  console.log("\n✨ 解析完了\n");
}

main();
