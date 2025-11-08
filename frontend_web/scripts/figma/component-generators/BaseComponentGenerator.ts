/**
 * Base Component Generator
 *
 * すべてのコンポーネントジェネレータの基底クラス
 * 共通のFigmaデータ抽出ロジックを提供
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { convertAutoLayoutToClasses } from "../utils/layout-converter";
import {
  resolveCornerRadiusToTailwindClass,
  resolveVariableToTailwindClass,
} from "../utils/variable-resolver";

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  componentId?: string;
  layoutMode?: "HORIZONTAL" | "VERTICAL" | "NONE" | null;
  paddingLeft?: number | null;
  paddingRight?: number | null;
  paddingTop?: number | null;
  paddingBottom?: number | null;
  itemSpacing?: number | null;
  primaryAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN" | null;
  counterAxisAlignItems?: "MIN" | "CENTER" | "MAX" | null;
  cornerRadius?: number;
  fills?: Array<{
    type: string;
    color?: { r: number; g: number; b: number; a: number };
    boundVariables?: {
      color?: {
        type: string;
        id: string;
      };
    };
  }>;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  [key: string]: any;
}

export interface ColorClasses {
  bgClass: string;
  textClass: string;
}

export interface VariantInfo {
  name: string;
  node: FigmaNode;
  colors: ColorClasses;
  layoutClasses: string[];
  cornerRadiusClass: string;
}

export abstract class BaseComponentGenerator {
  /**
   * Figma Page JSON から COMPONENT_SET を探す
   */
  protected findComponentSet(
    pageJsonPath: string,
    componentSetName: string,
  ): FigmaNode | null {
    if (!fs.existsSync(pageJsonPath)) {
      console.warn(`⚠️  ${pageJsonPath} が見つかりません`);
      return null;
    }

    const pageData = JSON.parse(fs.readFileSync(pageJsonPath, "utf-8"));
    return this.findNodeByName(pageData.data, componentSetName);
  }

  /**
   * 再帰的にノードを名前で検索
   */
  protected findNodeByName(node: FigmaNode, name: string): FigmaNode | null {
    if (node.name === name && node.type === "COMPONENT_SET") return node;

    if (node.children) {
      for (const child of node.children) {
        const found = this.findNodeByName(child, name);
        if (found) return found;
      }
    }

    return null;
  }

  /**
   * COMPONENT_SET から指定された variant を抽出
   *
   * @param componentSet - COMPONENT_SET ノード
   * @param variantFilter - variant名のフィルタ関数（例: name => name.includes("State=Active")）
   * @returns variant ノード
   */
  protected findVariant(
    componentSet: FigmaNode,
    variantFilter: (name: string) => boolean,
  ): FigmaNode | null {
    if (!componentSet.children) return null;

    return (
      componentSet.children.find((child: FigmaNode) =>
        variantFilter(child.name),
      ) || null
    );
  }

  /**
   * COMPONENT_SET からすべての variant を抽出し、情報を収集
   */
  protected extractAllVariants(
    componentSet: FigmaNode,
  ): Map<string, VariantInfo> {
    const variants = new Map<string, VariantInfo>();

    if (!componentSet.children) return variants;

    for (const child of componentSet.children) {
      if (child.type !== "COMPONENT") continue;

      const variantInfo: VariantInfo = {
        name: child.name,
        node: child,
        colors: this.extractColorClasses(child),
        layoutClasses: convertAutoLayoutToClasses(child as any),
        cornerRadiusClass: resolveCornerRadiusToTailwindClass(
          child.cornerRadius || 0,
        ),
      };

      variants.set(child.name, variantInfo);
    }

    return variants;
  }

  /**
   * Figma Node から背景色とテキスト色の Tailwind クラスを抽出
   */
  protected extractColorClasses(node: FigmaNode): ColorClasses {
    // fills から背景色の Variable ID を取得
    const fills = node.fills || [];
    let bgClass = "bg-transparent";

    if (fills.length > 0 && fills[0].boundVariables?.color?.id) {
      const variableId = fills[0].boundVariables.color.id;
      const rgbColor = fills[0].color || { r: 0, g: 0, b: 0 };
      bgClass = resolveVariableToTailwindClass(variableId, rgbColor);
    }

    // 子要素のテキストから色を取得
    const textNode = node.children?.find(
      (child: FigmaNode) => child.type === "TEXT",
    );
    let textClass = "text-foreground";

    if (textNode?.fills && textNode.fills.length > 0) {
      const textFill = textNode.fills[0];
      if (textFill.boundVariables?.color?.id) {
        const variableId = textFill.boundVariables.color.id;
        const rgbColor = textFill.color || { r: 0, g: 0, b: 0 };
        textClass = resolveVariableToTailwindClass(variableId, rgbColor);
      }
    }

    return { bgClass, textClass };
  }

  /**
   * Auto Layout 情報を抽出して Tailwind クラスを生成
   */
  protected extractLayoutClasses(node: FigmaNode): string[] {
    return convertAutoLayoutToClasses(node as any);
  }

  /**
   * Corner Radius を抽出して Tailwind クラスを生成
   */
  protected extractCornerRadiusClass(node: FigmaNode): string {
    return resolveCornerRadiusToTailwindClass(node.cornerRadius || 0);
  }

  /**
   * variant名からプロパティ値を抽出
   * 例: "State=Active, Size=Small" → { State: "Active", Size: "Small" }
   */
  protected parseVariantName(variantName: string): Record<string, string> {
    const props: Record<string, string> = {};
    const parts = variantName.split(",").map((s) => s.trim());

    for (const part of parts) {
      const [key, value] = part.split("=").map((s) => s.trim());
      if (key && value) {
        props[key] = value;
      }
    }

    return props;
  }

  /**
   * variant情報からvariantsオブジェクトを構築
   * 例: { State: { active: "...", default: "..." }, Size: { small: "...", medium: "..." } }
   */
  protected buildVariantsObject(
    variants: Map<string, VariantInfo>,
    propertyNames: string[],
  ): Record<string, Record<string, string>> {
    const result: Record<string, Record<string, string>> = {};

    // プロパティごとに初期化
    for (const propName of propertyNames) {
      result[propName] = {};
    }

    // 各variantを処理
    for (const [variantName, info] of variants.entries()) {
      const props = this.parseVariantName(variantName);

      for (const propName of propertyNames) {
        const propValue = props[propName];
        if (!propValue) continue;

        // 値をlowerCaseに変換（例: "Active" → "active"）
        const key = propValue.toLowerCase();

        // クラスを結合
        const classes = `${info.colors.bgClass} ${info.colors.textClass}`;

        result[propName][key] = classes;
      }
    }

    return result;
  }

  /**
   * defaultVariantsオブジェクトを構築
   * COMPONENT_SETのdefaultValueから取得
   */
  protected buildDefaultVariants(
    componentSet: FigmaNode,
    propertyNames: string[],
  ): Record<string, string> {
    const defaults: Record<string, string> = {};
    const propDefs = componentSet.componentPropertyDefinitions || {};

    for (const propName of propertyNames) {
      const propDef = propDefs[propName];
      if (propDef?.defaultValue) {
        defaults[propName.toLowerCase()] = propDef.defaultValue.toLowerCase();
      }
    }

    return defaults;
  }

  /**
   * cva のvariantsコードを生成
   */
  protected generateCvaVariantsCode(
    baseClasses: string,
    variants: Record<string, Record<string, string>>,
    defaultVariants: Record<string, string>,
  ): string {
    const variantsJson = JSON.stringify(variants, null, 6)
      .split("\n")
      .map((line, index) => (index === 0 ? line : `      ${line}`))
      .join("\n");

    const defaultVariantsJson = JSON.stringify(defaultVariants, null, 6)
      .split("\n")
      .map((line, index) => (index === 0 ? line : `      ${line}`))
      .join("\n");

    return `  "${baseClasses}",
  {
    variants: ${variantsJson},
    defaultVariants: ${defaultVariantsJson},
  }`;
  }
}
