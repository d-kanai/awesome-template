/**
 * Component Generators Registry
 *
 * 各コンポーネントごとの生成ロジックを登録・管理
 */

import type { ComponentGenerator } from "./types";
import { ButtonGenerator } from "./ButtonGenerator";
import { IconButtonGenerator } from "./IconButtonGenerator";
import { InputFieldGenerator } from "./InputFieldGenerator";

/**
 * 登録されたコンポーネントジェネレーター一覧
 *
 * 優先度順に並べる（上から順にチェックされる）
 */
export const componentGenerators: ComponentGenerator[] = [
  new InputFieldGenerator(), // 10プロパティ - 最も具体的
  new IconButtonGenerator(), // 4プロパティ
  new ButtonGenerator(), // 3プロパティ
];

/**
 * コンポーネントに適したジェネレーターを検索
 */
export function findGenerator(
  component: {
    componentSetProperties?: Record<string, { type: string; defaultValue: string }>;
  },
): ComponentGenerator | null {
  for (const generator of componentGenerators) {
    if (generator.canHandle(component as any)) {
      return generator;
    }
  }
  return null;
}

export * from "./types";
export { ButtonGenerator } from "./ButtonGenerator";
export { IconButtonGenerator } from "./IconButtonGenerator";
export { InputFieldGenerator } from "./InputFieldGenerator";
