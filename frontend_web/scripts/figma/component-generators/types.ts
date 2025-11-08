/**
 * Component Generator Types
 *
 * コンポーネント生成ロジックを外部化するための型定義
 */

export interface ComponentInfo {
  id: string;
  name: string;
  componentSetName?: string;
  componentSetProperties?: Record<string, { type: string; defaultValue: string }>;
  variantProperties?: Record<string, string>;
  description?: string;
  documentationLinks?: Array<{ uri: string }>;
}

export interface GeneratedComponent {
  imports: string[];
  interfaceCode: string;
  componentCode: string;
}

export interface ComponentGenerator {
  /**
   * このジェネレーターが処理できるコンポーネントかどうかを判定
   */
  canHandle(component: ComponentInfo): boolean;

  /**
   * コンポーネント名を決定（オプション）
   */
  getComponentName?(components: ComponentInfo[]): string;

  /**
   * コンポーネントコードを生成
   */
  generate(
    components: ComponentInfo[],
    componentName: string,
  ): GeneratedComponent;
}

/**
 * Utility: キャメルケースに変換
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Utility: プロパティ情報を抽出
 */
export function extractProperties(component: ComponentInfo): {
  propertyNames: string[];
  propertyTypes: Record<string, string>;
  defaultValues: Record<string, string>;
} {
  const props = component.componentSetProperties || {};
  const propertyNames = Object.keys(props).map((key) =>
    key.replace(/#.*$/, ""),
  );
  const propertyTypes: Record<string, string> = {};
  const defaultValues: Record<string, string> = {};

  for (const [key, value] of Object.entries(props)) {
    const cleanKey = key.replace(/#.*$/, "");
    propertyTypes[cleanKey] = value.type;
    defaultValues[cleanKey] = value.defaultValue;
  }

  return { propertyNames, propertyTypes, defaultValues };
}
