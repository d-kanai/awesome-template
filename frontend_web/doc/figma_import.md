# Figma コンポーネント取り込みガイド

## 概要

Figma Desktop MCPを使用してFigmaデザインからReactコンポーネントを生成・取り込む際の手順とベストプラクティスをまとめたドキュメントです。

## 取り込み手順

### 1. スクリーンショットの取得

**重要**: まず `get_screenshot` を呼び出して、デザインのビジュアルを確認します。

```typescript
mcp__figma-desktop__get_screenshot({
  nodeId: "175:4449",
  clientLanguages: "typescript",
  clientFrameworks: "react"
})
```

**目的:**
- デザインの実際の見た目を視覚的に確認
- コンポーネントの全体像を把握
- 実装時の参照として使用

### 2. メタデータの取得

次に `get_metadata` を呼び出して、ノードの構造を理解します。

```typescript
mcp__figma-desktop__get_metadata({
  nodeId: "175:4449",
  clientLanguages: "typescript",
  clientFrameworks: "react"
})
```

**目的:**
- ノードの構造（レイヤー、子要素）を把握
- コンポーネントの全体像を理解
- 適切な粒度でコンポーネントを分割すべきか判断

### 3. 変数定義の取得

`get_variable_defs` を呼び出して、使用されているFigma変数を確認します。

```typescript
mcp__figma-desktop__get_variable_defs({
  nodeId: "175:4449",
  clientLanguages: "typescript",
  clientFrameworks: "react"
})
```

**目的:**
- デザイントークン（色、スペーシング、タイポグラフィなど）の値を確認
- プロジェクトの既存トークンとのマッピングを計画
- 変数の命名規則を理解

**出力例:**
```json
{
  "var(--sds-color-background-default-default)": "#ffffff",
  "var(--sds-size-space-200)": "8",
  "var(--sds-typography-body-font-family)": "Inter"
}
```

### 4. コード生成

理解を深めた上で `get_design_context` を呼び出してコードを生成します。

```typescript
mcp__figma-desktop__get_design_context({
  nodeId: "175:4449",
  clientLanguages: "typescript",
  clientFrameworks: "react"
})
```

**目的:**
- React + Tailwind CSSのコンポーネントコードを生成
- Figma変数はCSS変数形式（`var(--xxx, fallback)`）で出力される

## 生成されたコードの変換

### 現状の課題

Figma MCPが生成するコードは、Tailwindの任意値構文とCSS変数を使用します:

```tsx
// 生成されたコード
<div className="bg-[var(--sds-color-background-brand-tertiary,#f5f5f5)] p-[var(--sds-size-space-200,8px)]">
```

### 理想の形式

プロジェクトのTailwindトークンを使用する形式に変換:

```tsx
// 変換後
<div className="bg-sds_light-Background-Brand-Tertiary p-Space-200">
```

### 変換マッピング

プロジェクトの `design-tokens/tailwind-tokens.ts` で定義されたトークンにマッピングします。

**主なマッピング例:**

| Figma Variable | Tailwind Class |
|---------------|----------------|
| `var(--sds-color-background-brand-tertiary,#f5f5f5)` | `bg-sds_light-Background-Brand-Tertiary` |
| `var(--sds-color-text-default-default,#1e1e1e)` | `text-sds_light-Text-Default-Default` |
| `var(--sds-size-space-200,8px)` | `Space-200` |
| `var(--sds-size-radius-200,8px)` | `rounded-lg` |

## ツール

### 変換スクリプト

`scripts/figma/convert-figma-component.ts` を使用して、生成されたコードをプロジェクトのTailwindクラスに変換できます。

```bash
npx tsx scripts/figma/convert-figma-component.ts <input-file> [output-file]
```

## ファイル構成

### ディレクトリ構造

**重要:** 1コンポーネントにつき1ディレクトリを作成すること。

```
features/shared/figma_generated/
├── ButtonWithIcons/
│   ├── index.tsx                    # Re-export（必須）
│   ├── ButtonWithIcons.tsx          # 実装（必須）
│   ├── ButtonWithIcons.figma.tsx    # Code Connect（推奨）
│   └── ButtonWithIcons.stories.tsx  # Storybook（推奨）
├── DialogBody/
│   ├── index.tsx
│   ├── DialogBody.tsx
│   ├── DialogBody.figma.tsx
│   └── DialogBody.stories.tsx
└── Text/
    ├── index.tsx
    ├── Text.tsx
    ├── Text.figma.tsx
    └── Text.stories.tsx
```

**ファイル命名規則:**
- コンポーネント実装: `ComponentName.tsx`
- Code Connect: `ComponentName.figma.tsx`
- Storybook: `ComponentName.stories.tsx`
- Re-export: `index.tsx`

**index.tsx の例:**
```tsx
// ButtonWithIcons/index.tsx
export { default } from './ButtonWithIcons';
export type { ButtonWithIconsProps } from './ButtonWithIcons';
```

**メリット:**
- 関連ファイル（実装、Code Connect、Stories）が1箇所にまとまる
- `index.tsx`でre-exportするため、既存のインポートパスに影響しない
- 将来的にテストファイルやサブコンポーネントも追加しやすい
- コンポーネント削除時はディレクトリごと削除すれば完全に消せる

**インポート例:**
```tsx
// 外部からのインポート（index.tsxがre-exportするため変わらない）
import ButtonWithIcons from '@/features/shared/figma_generated/ButtonWithIcons';

// 同じfigma_generated内のコンポーネント間インポート
import ButtonWithIcons from '../ButtonWithIcons';
import Text from '../Text';
```

## コンポーネント実装ルール

### 0. **Figma情報を正とする（最重要）**

**原則:** Figma MCPの `get_design_context` で生成されたコードを**正として扱う**こと。

- ✅ **生成されたclassNameをそのまま使用**（特に`text-nowrap`, `w-full`, `shrink-0`などのレイアウト関連）
- ✅ Figmaで設定されたレイアウト・スタイルを尊重する
- ❌ 勝手に`text-nowrap`を追加・削除しない
- ❌ 勝手に`shrink-0`を追加・削除しない
- ❌ Figmaにない装飾やスタイルを追加しない

**変換してよいもの:**
- CSS変数形式のトークン → Tailwindクラス（例: `var(--sds-color-*)` → `bg-primary`）
- セマンティック変数への置き換え（ダークモード対応のため）
- Props化（バリアント、テキスト内容など）
- Ref対応の追加
- インタラクションハンドラーの追加

**変換してはいけないもの:**
- レイアウト関連のクラス（`flex`, `w-full`, `shrink-0`, `text-nowrap`など）
- スペーシング、サイズ
- フォントスタイル、行間

**例:**
```tsx
// Figmaから生成されたコード
<p className="font-sans font-normal leading-[1.4] relative shrink-0 text-base w-full">
  {text}
</p>

// ✅ 正しい変換（トークンのみ置き換え）
<p className="font-sans font-normal leading-[1.4] relative shrink-0 text-foreground text-base w-full">
  {text}
</p>

// ❌ 間違った変換（勝手にtext-nowrapを追加）
<p className="font-sans font-normal leading-[1.4] relative shrink-0 text-foreground text-base text-nowrap whitespace-pre">
  {text}
</p>
```

### 1. Props設計

**必須Props:**
- `className?: string` - 外部からスタイルをカスタマイズ可能にする

**インタラクション:**
- インタラクティブなコンポーネント（ボタン、リンク、入力欄など）には以下を追加:
  - `onClick?: () => void`
  - `onChange?: (value: any) => void`
  - `onFocus?: () => void`
  - `onBlur?: () => void`
  - その他、必要に応じたイベントハンドラー

**Ref対応:**
- 基本的に全てのコンポーネントで`ref`を受け取れるようにする
- React.forwardRefを使用して実装

```tsx
// ✅ 良い例
type ButtonProps = {
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, onClick, children }, ref) => {
    return (
      <button ref={ref} onClick={onClick} className={className}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
```

```tsx
// ❌ 悪い例（refが無い）
export default function Button({ variant, className, children }: ButtonProps) {
  return <button className={className}>{children}</button>;
}
```

### 2. セマンティック変数の使用

Figma MCPが生成する`sds_light-*`トークンは直接使用せず、セマンティックCSS変数にマッピング:

```tsx
// ❌ 悪い例（lightを直接埋め込むとダークモードで動作しない）
<button className="bg-sds_light-Background-Brand-Default text-sds_light-Text-Brand-On-Brand">

// ✅ 良い例（セマンティック変数でダークモード自動対応）
<button className="bg-primary text-primary-foreground">
```

**主なマッピング:**
| Figma Token | Semantic Variable |
|-------------|------------------|
| `sds_light-Background-Brand-Default` | `primary` |
| `sds_light-Background-Neutral-Tertiary` | `neutral` |
| `sds_light-Text-Default-Default` | `foreground` |
| `sds_light-Border-Default-Default` | `border` |

### 3. アクセシビリティ

- インタラクティブ要素には適切なARIA属性を追加
- キーボード操作をサポート
- フォーカス管理を適切に実装

```tsx
<button
  ref={ref}
  onClick={onClick}
  disabled={disabled}
  aria-label={ariaLabel}
  aria-disabled={disabled}
>
  {children}
</button>
```

### 4. 生成タイムスタンプ

**重要:** 全てのFigmaから生成したコンポーネントには、ファイル先頭に**目立つ形で**生成日時（JST）を記載すること。

```tsx
/**
 * ============================================
 * 🎨 Generated from Figma
 * 📅 Generated at: 2025-01-15 14:30:45 JST
 * 🔗 Node ID: 4185:3778
 * ============================================
 *
 * Button With Icons Component
 *
 * Features:
 * - Left/Right icon support
 * - Semantic variables for dark mode
 * - Full accessibility support
 */
```

**目的:**
- Figmaデザインの更新タイミングと比較可能
- 古いコンポーネントの識別が容易
- 差分反映の判断材料として使用

## ベストプラクティス

### 1. 段階的な理解

取り込む前に必ず以下の順序で情報を収集:
1. `get_screenshot` - ビジュアル確認
2. `get_metadata` - 構造理解
3. `get_variable_defs` - 変数理解
4. `get_design_context` - コード生成

### 2. トークンの一貫性

- Figma変数名とプロジェクトのトークン名のマッピングを維持
- 新しい変数が出現した場合、`design-tokens/tailwind-tokens.ts` への追加を検討
- **必ずセマンティック変数を使用**してダークモード対応

### 3. コンポーネントの粒度

- 大きなコンポーネントは適切な粒度で分割
- 再利用可能な部品は別コンポーネントとして抽出

### 4. レビュー

生成されたコードは必ずレビューし、以下を確認:
- **Ref対応**（React.forwardRef使用）
- **インタラクションProps**（onClick等の追加）
- **セマンティック変数の使用**（sds_light直接使用禁止）
- アクセシビリティ（alt属性、ARIA属性など）
- セマンティックHTML
- パフォーマンス（画像最適化など）

## Figma Code Connect

### 概要

Code Connectは、FigmaコンポーネントとReact実装を紐付けるための仕組みです。これにより、Figmaのデザインファイルから実際のコードスニペットを表示できます。

### Code Connectファイルの作成

コンポーネントごとに `.figma.tsx` ファイルを作成します：

```tsx
// ButtonWithIcons.figma.tsx
import figma from "@figma/code-connect";
import ButtonWithIcons from "./ButtonWithIcons";

// Figma File Key from environment variable
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || "WoOuJeIanK8Ke56zr6muug";
const FIGMA_URL = `https://www.figma.com/design/${FIGMA_FILE_KEY}`;

figma.connect(
  ButtonWithIcons,
  `${FIGMA_URL}?node-id=4185:3778`,
  {
    props: {
      variant: figma.enum("Variant", {
        Primary: "primary",
        Neutral: "neutral",
        Subtle: "subtle",
      }),
      size: figma.enum("Size", {
        Medium: "medium",
        Small: "small",
      }),
    },
    example: ({ variant, size }) => (
      <ButtonWithIcons variant={variant} size={size}>
        Button
      </ButtonWithIcons>
    ),
  }
);
```

**重要:** Figma URLは環境変数から読み込むこと。ハードコードしない。

### 自動生成と手動作成

**手動作成（現在の方法）:**
- `.figma.tsx` ファイルを手動で作成
- Figmaのバリアント名とReact propsをマッピング
- メリット: 柔軟にカスタマイズ可能
- デメリット: 初回作成に時間がかかる

**CLI補助機能:**
- `pnpm figma:connect:create` - 新しいCode Connectファイルのテンプレート生成
- `pnpm figma:connect:publish` - Code ConnectをFigmaに公開
- `pnpm figma:connect:unpublish` - 公開済みCode Connectを削除

### ベストプラクティス

1. **コンポーネントと同じディレクトリに配置**
   ```
   ButtonWithIcons/
   ├── index.tsx
   ├── ButtonWithIcons.tsx
   ├── ButtonWithIcons.figma.tsx
   └── ButtonWithIcons.stories.tsx
   ```

2. **全バリアントをカバー**
   - 主要なバリアント組み合わせをexampleで提供
   - アイコン付き/なしなど、よくあるパターンを網羅

3. **タイムスタンプを記載**
   ```tsx
   /**
    * 🔗 Figma Code Connect
    * 📅 Created at: 2025-11-09 09:54:30 JST
    * 🔗 Node ID: 4185:3778
    */
   ```

4. **公開前にバリデーション**
   ```bash
   pnpm figma:connect:publish --dry-run
   ```

### Code Connectの公開

1. Figma Access Tokenを取得（Personal Access Token with `file:read` permission）
2. 環境変数に設定：
   ```bash
   export FIGMA_ACCESS_TOKEN="your-token-here"
   ```
3. 公開：
   ```bash
   pnpm figma:connect:publish
   ```

公開後、Figmaのデザインファイルで「Dev Mode」に切り替えると、実際のReactコードが表示されるようになります。

## 参考

- Figma Desktop MCP: https://github.com/figma/code-connect
- Figma Code Connect Docs: https://www.figma.com/developers/code-connect
- プロジェクトのデザイントークン: `frontend_web/design-tokens/tailwind-tokens.ts`
- Tailwind設定: `frontend_web/tailwind.config.ts`
