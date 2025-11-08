/**
 * Component Generators Registry
 *
 * 各コンポーネントごとの生成ロジックを登録・管理
 */

import { ButtonGenerator } from "./ButtonGenerator";
import { HeaderGenerator } from "./HeaderGenerator";
import { IconButtonGenerator } from "./IconButtonGenerator";
import { InputFieldGenerator } from "./InputFieldGenerator";
import { NavigationPillGenerator } from "./NavigationPillGenerator";
import { NavigationPillListGenerator } from "./NavigationPillListGenerator";
import type { ComponentGenerator, ComponentInfo } from "./types";

/**
 * 登録されたコンポーネントジェネレーター一覧
 *
 * 優先度順に並べる（上から順にチェックされる）
 */
export const componentGenerators: ComponentGenerator[] = [
  new HeaderGenerator(), // Page-level component
  new NavigationPillListGenerator(), // Navigation container
  new NavigationPillGenerator(), // Navigation component
  new InputFieldGenerator(), // 10プロパティ - 最も具体的
  new IconButtonGenerator(), // 4プロパティ
  new ButtonGenerator(), // 3プロパティ
];

/**
 * コンポーネントに適したジェネレーターを検索
 */
export function findGenerator(
  component: ComponentInfo,
): ComponentGenerator | null {
  for (const generator of componentGenerators) {
    if (generator.canHandle(component)) {
      return generator;
    }
  }
  return null;
}

export * from "./types";
export { ButtonGenerator } from "./ButtonGenerator";
export { IconButtonGenerator } from "./IconButtonGenerator";
export { InputFieldGenerator } from "./InputFieldGenerator";
export { HeaderGenerator } from "./HeaderGenerator";
export { NavigationPillGenerator } from "./NavigationPillGenerator";
export { NavigationPillListGenerator } from "./NavigationPillListGenerator";
