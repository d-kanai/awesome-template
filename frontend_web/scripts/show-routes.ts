import * as fs from "node:fs";
import * as path from "node:path";

// routes.ts ファイルを自動検出
function findRouteFiles(): string[] {
  const files: string[] = [];

  // shared/lib/routes.ts
  const sharedRoutes = path.join(process.cwd(), "shared/lib/routes.ts");
  if (fs.existsSync(sharedRoutes)) files.push(sharedRoutes);

  // features/*/routes.ts
  const featuresDir = path.join(process.cwd(), "features");
  if (fs.existsSync(featuresDir)) {
    const features = fs.readdirSync(featuresDir, { withFileTypes: true });
    for (const feature of features) {
      if (!feature.isDirectory()) continue;
      const routeFile = path.join(featuresDir, feature.name, "routes.ts");
      if (fs.existsSync(routeFile)) files.push(routeFile);
    }
  }

  return files;
}

// routes.ts ファイルから定数を自動抽出
function loadRouteMap(): Record<string, string> {
  const routeMap: Record<string, string> = {};
  const routeFiles = findRouteFiles();

  for (const fullPath of routeFiles) {
    const content = fs.readFileSync(fullPath, "utf-8");
    // export const XXX_ROUTES = { KEY: "/path", ... } を抽出
    const constMatch = content.match(
      /export\s+const\s+(\w+_ROUTES)\s*=\s*\{([^}]+)\}/s,
    );
    if (!constMatch) continue;

    const constName = constMatch[1];
    const body = constMatch[2];
    if (!body) continue;

    // KEY: "/path" のペアを抽出
    const pairs = body.matchAll(/(\w+):\s*["']([^"']+)["']/g);
    for (const pair of pairs) {
      const key = pair[1];
      const value = pair[2];
      routeMap[`${constName}.${key}`] = value ?? "";
    }
  }

  return routeMap;
}

// app ディレクトリ構造から URL マッピングを自動生成
function loadFileToUrl(): Record<string, string> {
  const mapping: Record<string, string> = {};

  // app ディレクトリの page.tsx から URL を推測
  function scanAppDir(dir: string, urlPath: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // (group) フォルダは URL に含めない
        const segment = entry.name.startsWith("(") ? "" : `/${entry.name}`;
        scanAppDir(fullPath, `${urlPath}${segment}`);
      } else if (entry.name === "page.tsx") {
        const relativePath = fullPath.replace(`${process.cwd()}/`, "");
        mapping[relativePath] = urlPath || "/";
      }
    }
  }

  scanAppDir(path.join(process.cwd(), "app"), "");

  // features/*/screens/*Screen.tsx をスキャン
  const featuresDir = path.join(process.cwd(), "features");
  if (fs.existsSync(featuresDir)) {
    const features = fs.readdirSync(featuresDir, { withFileTypes: true });
    for (const feature of features) {
      if (!feature.isDirectory() || feature.name === "shared") continue;

      const screensDir = path.join(featuresDir, feature.name, "screens");
      if (!fs.existsSync(screensDir)) continue;

      const screens = fs.readdirSync(screensDir);
      for (const screen of screens) {
        if (!screen.endsWith("Screen.tsx") || screen.includes(".spec."))
          continue;

        const relativePath = `features/${feature.name}/screens/${screen}`;
        // Screen 名から URL を推測 (例: SigninScreen.tsx -> /auth/signin)
        const screenName = screen.replace("Screen.tsx", "").toLowerCase();

        if (screenName === "home") {
          mapping[relativePath] = "/";
        } else {
          mapping[relativePath] = `/${feature.name}/${screenName}`;
        }
      }
    }
  }

  // components も追加 (SigninForm などのフォームコンポーネント)
  if (fs.existsSync(featuresDir)) {
    const features = fs.readdirSync(featuresDir, { withFileTypes: true });
    for (const feature of features) {
      if (!feature.isDirectory() || feature.name === "shared") continue;

      const componentsDir = path.join(featuresDir, feature.name, "components");
      if (!fs.existsSync(componentsDir)) continue;

      const components = fs.readdirSync(componentsDir);
      for (const comp of components) {
        if (!comp.endsWith("Form.tsx") || comp.includes(".spec.")) continue;

        const relativePath = `features/${feature.name}/components/${comp}`;
        // Form 名から URL を推測 (例: SigninForm.tsx -> /auth/signin)
        const formName = comp.replace("Form.tsx", "").toLowerCase();
        mapping[relativePath] = `/${feature.name}/${formName}`;
      }
    }
  }

  return mapping;
}

const ROUTE_MAP = loadRouteMap();
const FILE_TO_URL = loadFileToUrl();

function resolveRoute(raw: string): string {
  const cleaned = raw.trim().replace(/['"]/g, "");
  return ROUTE_MAP[cleaned] ?? cleaned;
}

function findFiles(dir: string, ext: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.includes("node_modules") &&
      !file.includes(".next")
    ) {
      results.push(...findFiles(filePath, ext));
    } else if (
      file.endsWith(ext) &&
      !file.includes(".spec.") &&
      !file.includes(".test.")
    ) {
      results.push(filePath);
    }
  }
  return results;
}

function extractTransitions(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const transitions: string[] = [];

  const pushMatches = content.matchAll(/router\.push\(([^)]+)\)/g);
  for (const match of pushMatches) {
    const to = resolveRoute(match[1] ?? "");
    if (!to.includes("result.") && !to.includes("redirect"))
      transitions.push(to);
  }

  const redirectMatches = content.matchAll(/redirect\(([^)]+)\)/g);
  for (const match of redirectMatches) {
    transitions.push(resolveRoute(match[1] ?? ""));
  }

  const linkMatches = content.matchAll(/<Link[^>]*href=\{([^}]+)\}/g);
  for (const match of linkMatches) {
    transitions.push(resolveRoute(match[1] ?? ""));
  }

  return [...new Set(transitions)];
}

function buildGraph(): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  const dirs = ["features", "app"];

  for (const dir of dirs) {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      const files = [
        ...findFiles(fullPath, ".tsx"),
        ...findFiles(fullPath, ".ts"),
      ];
      for (const file of files) {
        const transitions = extractTransitions(file);
        if (transitions.length > 0) {
          const relativePath = file.replace(`${process.cwd()}/`, "");
          const fromUrl = FILE_TO_URL[relativePath];
          if (fromUrl) {
            const existing = graph.get(fromUrl) ?? [];
            graph.set(fromUrl, [...new Set([...existing, ...transitions])]);
          }
        }
      }
    }
  }

  return graph;
}

function printTree(
  graph: Map<string, string[]>,
  node: string,
  indent: string,
  visited: Set<string>,
  isLast: boolean,
): void {
  const prefix = indent + (isLast ? "└─ " : "├─ ");
  const childIndent = indent + (isLast ? "   " : "│  ");

  if (visited.has(node)) {
    console.log(`${prefix}${node} (循環)`);
    return;
  }

  console.log(`${prefix}${node}`);
  visited.add(node);

  const children = (graph.get(node) ?? []).sort();
  children.forEach((child, i) => {
    const isChildLast = i === children.length - 1;
    printTree(graph, child, childIndent, new Set(visited), isChildLast);
  });
}

function main() {
  const graph = buildGraph();

  console.log("=== 画面遷移ツリー ===\n");
  console.log("/");

  const rootChildren = (graph.get("/") ?? []).sort();
  rootChildren.forEach((child, i) => {
    const isLast = i === rootChildren.length - 1;
    printTree(graph, child, "", new Set(["/"]), isLast);
  });
}

main();
