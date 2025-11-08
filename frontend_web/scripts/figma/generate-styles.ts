import * as fs from "node:fs";
import * as path from "node:path";

interface FigmaTextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeightPx?: number;
  lineHeightPercent?: number;
  letterSpacing?: number;
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

interface EffectStyleInfo {
  key: string;
  name: string;
  description: string;
  nodeId: string;
  effects: FigmaEffect[];
}

interface FigmaStylesData {
  generatedAt: string;
  fileKey: string;
  textStyles: TextStyleInfo[];
  colorStyles: ColorStyleInfo[];
  effectStyles: EffectStyleInfo[];
}

function toKebabCase(str: string): string {
  return str
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function toCamelCase(str: string): string {
  return str
    .split(/[-_\s/]+/)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");
}

function rgbaToString(color: {
  r: number;
  g: number;
  b: number;
  a: number;
}): string {
  return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`;
}

function generateTextStyleCSS(styles: TextStyleInfo[]): string {
  const lines: string[] = [
    "/* Figma Text Styles */",
    "/* Auto-generated from Figma - Do not edit manually */\n",
  ];

  for (const style of styles) {
    // Figma側の名前を自動的にkebab-caseに変換
    const varName = toKebabCase(style.name);
    const { fontFamily, fontSize, fontWeight, lineHeightPx, letterSpacing } =
      style.style;

    lines.push(`/* ${style.name} */`);
    lines.push(`.text-${varName} {`);
    lines.push(`  font-family: ${fontFamily};`);
    lines.push(`  font-size: ${fontSize}px;`);
    lines.push(`  font-weight: ${fontWeight};`);
    if (lineHeightPx) {
      lines.push(`  line-height: ${lineHeightPx}px;`);
    }
    if (letterSpacing) {
      lines.push(`  letter-spacing: ${letterSpacing}px;`);
    }
    lines.push("}\n");
  }

  return lines.join("\n");
}

function generateColorStyleCSS(styles: ColorStyleInfo[]): string {
  const lines: string[] = [
    "/* Figma Color Styles */",
    "/* Auto-generated from Figma - Do not edit manually */\n",
    ":root {",
  ];

  for (const style of styles) {
    const varName = toKebabCase(style.name);
    lines.push(`  --color-${varName}: ${style.color};`);
  }

  lines.push("}\n");
  return lines.join("\n");
}

function generateEffectStyleCSS(styles: EffectStyleInfo[]): string {
  const lines: string[] = [
    "/* Figma Effect Styles */",
    "/* Auto-generated from Figma - Do not edit manually */\n",
    ":root {",
  ];

  for (const style of styles) {
    const varName = toKebabCase(style.name);
    const shadows = style.effects
      .filter((e) => e.visible && e.type === "DROP_SHADOW")
      .map((effect) => {
        const offsetX = effect.offset?.x || 0;
        const offsetY = effect.offset?.y || 0;
        const radius = effect.radius || 0;
        const color = effect.color
          ? rgbaToString(effect.color)
          : "rgba(0, 0, 0, 0.25)";
        return `${offsetX}px ${offsetY}px ${radius}px ${color}`;
      })
      .join(", ");

    if (shadows) {
      lines.push(`  --shadow-${varName}: ${shadows};`);
    }
  }

  lines.push("}\n");
  return lines.join("\n");
}

function generateTailwindTheme(data: FigmaStylesData): string {
  const colors: Record<string, string> = {};
  const fontSizes: Record<string, string> = {};
  const boxShadows: Record<string, string> = {};

  // Color Styles
  for (const style of data.colorStyles) {
    const key = toCamelCase(style.name);
    colors[key] = style.color;
  }

  // Text Styles (fontSize only for Tailwind)
  for (const style of data.textStyles) {
    const key = toCamelCase(style.name);
    fontSizes[key] = `${style.style.fontSize}px`;
  }

  // Effect Styles
  for (const style of data.effectStyles) {
    const key = toCamelCase(style.name);
    const shadows = style.effects
      .filter((e) => e.visible && e.type === "DROP_SHADOW")
      .map((effect) => {
        const offsetX = effect.offset?.x || 0;
        const offsetY = effect.offset?.y || 0;
        const radius = effect.radius || 0;
        const color = effect.color
          ? rgbaToString(effect.color)
          : "rgba(0, 0, 0, 0.25)";
        return `${offsetX}px ${offsetY}px ${radius}px ${color}`;
      })
      .join(", ");

    if (shadows) {
      boxShadows[key] = shadows;
    }
  }

  return `/**
 * Figma Design Tokens - Tailwind Theme Extension
 * Auto-generated from Figma - Do not edit manually
 * Generated at: ${data.generatedAt}
 */

export const figmaTheme = {
  extend: {
    colors: ${JSON.stringify(colors, null, 6).replace(/\n/g, "\n    ")},
    fontSize: ${JSON.stringify(fontSizes, null, 6).replace(/\n/g, "\n    ")},
    boxShadow: ${JSON.stringify(boxShadows, null, 6).replace(/\n/g, "\n    ")},
  },
};
`;
}

async function main() {
  console.log("🎨 Figma スタイル生成開始");

  try {
    // JSONファイルを読み込み
    const inputPath = path.resolve(
      process.cwd(),
      "design-tokens/figma-styles.json",
    );

    if (!fs.existsSync(inputPath)) {
      console.error("\n❌ figma-styles.json が見つかりません");
      console.error("   先に 'pnpm run figma:fetch:styles' を実行してください");
      process.exit(1);
    }

    const data: FigmaStylesData = JSON.parse(
      fs.readFileSync(inputPath, "utf-8"),
    );

    console.log(`\n📦 スタイル情報を読み込みました`);
    console.log(`   Text Styles: ${data.textStyles.length} 個`);
    console.log(`   Color Styles: ${data.colorStyles.length} 個`);
    console.log(`   Effect Styles: ${data.effectStyles.length} 個`);

    // 出力ディレクトリ
    const outputDir = path.resolve(process.cwd(), "styles/figma");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // CSS ファイル生成
    const cssContent = [
      generateTextStyleCSS(data.textStyles),
      generateColorStyleCSS(data.colorStyles),
      generateEffectStyleCSS(data.effectStyles),
    ].join("\n");

    const cssPath = path.join(outputDir, "figma-styles.css");
    fs.writeFileSync(cssPath, cssContent);
    console.log(`\n✅ CSS ファイルを生成: ${cssPath}`);

    // Tailwind Theme ファイル生成
    const themeContent = generateTailwindTheme(data);
    const themePath = path.join(outputDir, "figma-theme.ts");
    fs.writeFileSync(themePath, themeContent);
    console.log(`✅ Tailwind Theme ファイルを生成: ${themePath}`);

    console.log("\n📝 次のステップ:");
    console.log("   1. tailwind.config.ts に figmaTheme をインポート");
    console.log("   2. app/globals.css に figma-styles.css をインポート");
    console.log("   3. Text Styles: .text-{style-name} クラスで使用");
    console.log("   4. Color Styles: --color-{style-name} CSS変数で使用");
    console.log("   5. Effect Styles: --shadow-{style-name} CSS変数で使用");

    console.log("\n✨ 完了！");
  } catch (error) {
    console.error("\n❌ エラーが発生しました:");
    console.error(error);
    process.exit(1);
  }
}

main();
