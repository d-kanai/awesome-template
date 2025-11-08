# Component Generators

Figma REST APIから取得したコンポーネント情報を元に、Reactコンポーネントを自動生成するジェネレーター群です。

## 概要

コンポーネントごとの生成ロジックを外部化し、プラグイン的に追加・管理できる構造になっています。

```
component-generators/
├── types.ts                  # 共通型定義とユーティリティ
├── index.ts                  # ジェネレーターレジストリ
├── ButtonGenerator.ts        # Button コンポーネント生成
├── IconButtonGenerator.ts    # IconButton コンポーネント生成
├── InputFieldGenerator.ts    # InputField コンポーネント生成
└── README.md                 # このファイル
```

## 使い方

### 既存のジェネレーター使用

```bash
# Figmaからコンポーネントデータを取得し、Reactコンポーネントを生成
pnpm run figma:sync:components
```

### 新しいジェネレーターの追加

1. **Generatorクラスを作成**

```typescript
// CheckboxGenerator.ts
import type { ComponentGenerator, ComponentInfo, GeneratedComponent } from "./types";
import { extractProperties, toCamelCase } from "./types";

export class CheckboxGenerator implements ComponentGenerator {
  /**
   * このジェネレーターが処理できるコンポーネントかどうかを判定
   */
  canHandle(component: ComponentInfo): boolean {
    const props = component.componentSetProperties || {};
    const keys = Object.keys(props).map(key => key.replace(/#.*$/, '')).sort();

    // Checkbox特有のプロパティパターンをチェック
    return (
      keys.includes("State") &&
      keys.includes("Checked") &&
      keys.length === 3
    );
  }

  /**
   * コンポーネント名を決定（オプション）
   */
  getComponentName(components: ComponentInfo[]): string {
    return "Checkbox";
  }

  /**
   * コンポーネントコードを生成
   */
  generate(
    components: ComponentInfo[],
    componentName: string,
  ): GeneratedComponent {
    const { defaultValues } = extractProperties(components[0]);

    const imports = [
      'import type { ComponentPropsWithoutRef } from "react";',
      'import { type VariantProps, cva } from "class-variance-authority";',
      'import { cn } from "@/features/shared/lib/classNames";',
    ];

    const interfaceCode = `export interface ${componentName}Props
  extends ComponentPropsWithoutRef<"input">,
    VariantProps<typeof ${toCamelCase(componentName)}Variants> {}`;

    const componentCode = `const ${toCamelCase(componentName)}Variants = cva("...", {
  variants: {
    state: { default: "", disabled: "" },
    checked: { true: "", false: "" },
  },
  defaultVariants: {
    state: "default",
    checked: false,
  },
});

export function ${componentName}({
  className,
  state,
  checked,
  disabled,
  ...props
}: ${componentName}Props) {
  return (
    <input
      type="checkbox"
      className={cn(${toCamelCase(componentName)}Variants({ state, checked, className }))}
      checked={checked}
      disabled={disabled || state === "disabled"}
      {...props}
    />
  );
}`;

    return { imports, interfaceCode, componentCode };
  }
}
```

2. **レジストリに登録**

```typescript
// index.ts
import { CheckboxGenerator } from "./CheckboxGenerator";

export const componentGenerators: ComponentGenerator[] = [
  new InputFieldGenerator(),  // 最も具体的（10プロパティ）
  new IconButtonGenerator(),   // 4プロパティ
  new ButtonGenerator(),       // 3プロパティ
  new CheckboxGenerator(),     // 新規追加
];
```

## アーキテクチャ

### なぜコンポーネントごとに分岐が必要なのか？

Variables APIがあったとしても、以下の理由でコンポーネントごとの固有ロジックは必須です：

1. **構造の違い**: InputFieldは`<div><label/><input/><p/></div>`、Buttonは`<button>`だけ
2. **セマンティクスの違い**: 同じ"disabled"でもコンポーネントによって意味・実装が異なる
3. **アクセシビリティ**: ARIA属性の使い方はコンポーネント固有（input需要aria-invalid、aria-describedbyなど）
4. **条件ロジック**: `showError = state === "error" && hasError` のような条件はコンポーネント固有

### Generator Interface

```typescript
interface ComponentGenerator {
  /**
   * このジェネレーターが処理できるコンポーネントかどうかを判定
   * プロパティの数、名前、型などでパターンマッチング
   */
  canHandle(component: ComponentInfo): boolean;

  /**
   * コンポーネント名を決定（オプション）
   * 未実装の場合はデフォルトロジックでFigma名から生成
   */
  getComponentName?(components: ComponentInfo[]): string;

  /**
   * コンポーネントコードを生成
   * imports、interface、component本体の3つを返す
   */
  generate(
    components: ComponentInfo[],
    componentName: string,
  ): GeneratedComponent;
}
```

## 実装例

### ButtonGenerator

**判定条件**: Variant, Size, State の3プロパティを持つ

**生成コード**:
- CVAでvariant/size/state variants定義
- disabledはstateとdisabled propの両方を考慮
- 基本的なbutton要素のみ

### IconButtonGenerator

**判定条件**: Variant, Size, State, Icon の4プロパティを持つ

**生成コード**:
- ButtonGeneratorと似ているが、iconプロパティを追加
- childrenの代わりにiconを表示
- Omit<..., "children">でchildren propを除外

### InputFieldGenerator

**判定条件**: State, Value Type + 複数のboolean props（10プロパティ）

**生成コード**:
- 複合構造: div > label + input + description/error
- Boolean propは string も受け取れるように（`label?: boolean | string`）
- アクセシビリティ属性: aria-invalid, aria-describedby
- エラー表示とdescriptionの切り替えロジック
- Disabled状態で固有のFigma Variables使用

## ベストプラクティス

1. **優先度順に登録**: より具体的（プロパティ数が多い）なジェネレーターを先に登録
2. **明確なパターンマッチング**: `canHandle()`は誤検出しない よう慎重に実装
3. **アクセシビリティ配慮**: ARIA属性、セマンティックHTML、キーボード操作を考慮
4. **Figma Variables活用**: Plugin APIで取得した変数名を直接使用（disabled色など）

## トラブルシューティング

### コンポーネントが生成されない

- `canHandle()`の条件が厳しすぎる可能性があります
- デバッグ出力を追加してプロパティ構造を確認してください

### 重複したコンポーネントが生成される

- `componentGenerators`配列の順序を見直してください
- より具体的なジェネレーターを先に配置する必要があります

### スタイルが正しくない

- Figma Variables（Plugin API）の命名を確認してください
- `tailwind.config.ts`にVariablesが正しくインポートされているか確認してください
