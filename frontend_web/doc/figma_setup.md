# Figma Variables Setup

このドキュメントでは、Figma Design TokensをTailwind CSSに統合するセットアップ手順を説明します。

## 概要

Figma MCP (Model Context Protocol) を使用して、Figmaのデザイントークン（変数）を取得し、CSS変数とTailwind設定に変換します。

## セットアップ手順

### 1. Figma変数の取得

Figma MCPを使用して、デザイントークンを取得します。

```typescript
// MCPツールを使用
mcp__figma-desktop__get_variable_defs()
```

取得される変数の種類:
- **Color**: テキスト、背景、ボーダー、アイコンの色
- **Typography**: フォントサイズ、フォントファミリー、フォントウェイト
- **Size**: スペーシング、ボーダーラディウス、ストローク、深度、ブラー
- **Responsive**: デバイス幅、ボーダー幅

### 2. 構造化データの保存

取得した変数を構造化して`design-tokens/figma-variables.json`に保存します。

```json
{
  "color": {
    "text": { ... },
    "background": { ... },
    "border": { ... },
    "icon": { ... }
  },
  "typography": { ... },
  "size": { ... },
  "responsive": { ... }
}
```

### 3. CSS変数の定義 (globals.css)

`app/globals.css`にCSS変数として定義します。

```css
@layer base {
  :root {
    /* Color - Text */
    --sds-color-text-brand-on-brand-tertiary: #2c2c2c;
    --sds-color-text-brand-on-brand: #f5f5f5;
    --sds-color-text-brand-tertiary: #757575;
    --sds-color-text-default-default: #1e1e1e;
    --sds-color-text-default-tertiary: #b3b3b3;
    --sds-color-text-default-secondary: #757575;

    /* Color - Background */
    --sds-color-background-default-default: #ffffff;
    --sds-color-background-default-secondary: #f5f5f5;
    --sds-color-background-brand-default: #2c2c2c;
    --sds-color-background-brand-secondary: #e6e6e6;
    --sds-color-background-brand-tertiary: #f5f5f5;
    --sds-color-background-neutral-tertiary: #e3e3e3;

    /* Typography */
    --sds-typography-title-hero-size: 72px;
    --sds-typography-subtitle-size-base: 32px;
    --sds-typography-body-size-medium: 16px;
    --sds-typography-body-size-small: 14px;
    --sds-typography-heading-size-base: 24px;

    /* Size - Space */
    --sds-size-space-100: 4px;
    --sds-size-space-200: 8px;
    --sds-size-space-300: 12px;
    --sds-size-space-400: 16px;
    --sds-size-space-600: 24px;
    --sds-size-space-800: 32px;

    /* Size - Radius */
    --sds-size-radius-100: 4px;
    --sds-size-radius-200: 8px;
    --sds-size-radius-400: 16px;
    --sds-size-radius-full: 9999px;
  }

  .dark {
    /* Dark mode overrides will be added here */
  }
}

body {
  color: var(--sds-color-text-default-default);
  background: var(--sds-color-background-default-default);
  font-family: var(--sds-typography-body-font-family), sans-serif;
}
```

### 4. Tailwind設定の更新 (tailwind.config.ts)

CSS変数をTailwindユーティリティクラスとして使用できるように設定します。

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Text colors
        text: {
          brand: {
            "on-brand-tertiary": "var(--sds-color-text-brand-on-brand-tertiary)",
            "on-brand": "var(--sds-color-text-brand-on-brand)",
            tertiary: "var(--sds-color-text-brand-tertiary)",
          },
          default: {
            DEFAULT: "var(--sds-color-text-default-default)",
            tertiary: "var(--sds-color-text-default-tertiary)",
            secondary: "var(--sds-color-text-default-secondary)",
          },
        },
        // Background colors
        background: {
          default: {
            DEFAULT: "var(--sds-color-background-default-default)",
            secondary: "var(--sds-color-background-default-secondary)",
          },
          brand: {
            DEFAULT: "var(--sds-color-background-brand-default)",
            secondary: "var(--sds-color-background-brand-secondary)",
            tertiary: "var(--sds-color-background-brand-tertiary)",
          },
        },
        // Border colors
        border: {
          default: {
            DEFAULT: "var(--sds-color-border-default-default)",
          },
          brand: {
            DEFAULT: "var(--sds-color-border-brand-default)",
          },
        },
      },
      // Spacing
      spacing: {
        100: "var(--sds-size-space-100)",
        200: "var(--sds-size-space-200)",
        300: "var(--sds-size-space-300)",
        400: "var(--sds-size-space-400)",
        600: "var(--sds-size-space-600)",
        800: "var(--sds-size-space-800)",
        1200: "var(--sds-size-space-1200)",
        1600: "var(--sds-size-space-1600)",
      },
      // Border radius
      borderRadius: {
        100: "var(--sds-size-radius-100)",
        200: "var(--sds-size-radius-200)",
        400: "var(--sds-size-radius-400)",
        full: "var(--sds-size-radius-full)",
      },
      // Font family
      fontFamily: {
        body: ["var(--sds-typography-body-font-family)", "sans-serif"],
        heading: ["var(--sds-typography-heading-font-family)", "sans-serif"],
      },
      // Font size
      fontSize: {
        "title-hero": "var(--sds-typography-title-hero-size)",
        subtitle: "var(--sds-typography-subtitle-size-base)",
        "body-medium": "var(--sds-typography-body-size-medium)",
        "body-small": "var(--sds-typography-body-size-small)",
        heading: "var(--sds-typography-heading-size-base)",
      },
      // Font weight
      fontWeight: {
        "body-regular": "var(--sds-typography-body-font-weight-regular)",
        "body-strong": "var(--sds-typography-body-font-weight-strong)",
        heading: "var(--sds-typography-heading-font-weight)",
      },
    },
  },
  plugins: [],
};

export default config;
```

## 使用方法

### Tailwindユーティリティクラス

セットアップ後、以下のようなTailwindクラスが使用可能になります：

#### カラー
```tsx
// テキストカラー
<p className="text-text-default">Default text</p>
<p className="text-text-brand-on-brand">Brand text</p>

// 背景カラー
<div className="bg-background-default">Default background</div>
<div className="bg-background-brand">Brand background</div>

// ボーダーカラー
<div className="border border-border-default">Default border</div>
```

#### スペーシング
```tsx
<div className="p-400">16px padding</div>
<div className="m-200">8px margin</div>
<div className="gap-300">12px gap</div>
```

#### ボーダーラディウス
```tsx
<div className="rounded-200">8px radius</div>
<div className="rounded-400">16px radius</div>
<div className="rounded-full">9999px radius</div>
```

#### タイポグラフィ
```tsx
<h1 className="font-heading text-title-hero font-title-hero">
  Hero Title
</h1>
<p className="font-body text-body-medium font-body-regular">
  Body text
</p>
```

### CSS変数の直接使用

CSS変数を直接使用することもできます：

```tsx
<div style={{ color: 'var(--sds-color-text-default-default)' }}>
  Direct CSS variable usage
</div>
```

## デザイントークンの命名規則

### 接頭辞
- `--sds-`: Simple Design System の略

### カテゴリ
- `color-`: カラー関連
- `typography-`: タイポグラフィ関連
- `size-`: サイズ関連（スペーシング、ラディウスなど）
- `responsive-`: レスポンシブ設定

### 階層構造
```
--sds-{category}-{subcategory}-{property}
例: --sds-color-text-default-default
    --sds-size-space-400
    --sds-typography-body-size-medium
```

## ダークモード対応

ダークモードは`.dark`クラスで定義します：

```css
.dark {
  --sds-color-text-default-default: #ffffff;
  --sds-color-background-default-default: #1e1e1e;
  /* その他のダークモード用変数 */
}
```

コンポーネント側では自動的に切り替わります：

```tsx
<div className="text-text-default bg-background-default">
  {/* ダークモード時は自動的にダークカラーに切り替わる */}
</div>
```

## 更新手順

### Variables（変数）の更新

Figmaのデザイントークンが更新された場合：

1. MCPツールで最新の変数を取得
2. `design-tokens/figma-variables.json`を更新
3. `globals.css`のCSS変数を更新
4. 必要に応じて`tailwind.config.ts`を更新
5. 変更をコミット

### Styles（スタイル）の段階的な追加

**推奨アプローチ: コンポーネント実装と同時にスタイルを追加**

Figmaコンポーネントを実装する際に、そのコンポーネントで使用されているスタイルを同時に追加します。

#### ワークフロー

1. **Figmaコンポーネントを選択**
   - 実装したいコンポーネントをFigmaで選択

2. **MCPでデザインコンテキストを取得**
   ```typescript
   mcp__figma-desktop__get_design_context()
   ```

3. **スタイル情報を確認**
   - 取得したコード内の `Font(...)` パターンを探す
   - 例: `Font(family: "Inter", style: Regular, size: 16, weight: 400, lineHeight: 1.4)`

4. **新しいスタイルがあれば追加**

   a. `design-tokens/figma-styles.json`に追加:
   ```json
   {
     "typography": {
       "new-style-name": {
         "fontFamily": "Inter",
         "fontSize": 16,
         "fontWeight": 400,
         "lineHeight": 1.4,
         "description": "コンポーネント名での用途"
       }
     }
   }
   ```

   b. `globals.css`にCSSクラスを追加:
   ```css
   .text-new-style-name {
     font-family: var(--sds-typography-body-font-family), sans-serif;
     font-size: 16px;
     font-weight: 400;
     line-height: 1.4;
   }
   ```

5. **コンポーネントを実装**
   - スタイルクラスを使用してコンポーネントを実装

6. **コミット**
   - コンポーネントとスタイルを一緒にコミット

#### メリット

- ✅ 実際に使われるスタイルのみが定義される
- ✅ 未使用のスタイルで肥大化しない
- ✅ コンポーネントとスタイルの対応が明確
- ✅ 段階的に進められる
- ✅ テストしながら進められる

#### スタイル名の命名規則

コンポーネントから抽出したスタイル名は、以下の形式を推奨:

- `text-{component}-{variant}`: コンポーネント固有のスタイル
  - 例: `text-button-label`, `text-card-title`

- `text-{semantic-name}`: 汎用的なスタイル
  - 例: `text-body-base`, `text-heading`, `text-caption`

既に同じスタイルが存在する場合は、既存のスタイル名を再利用してください。

## Figma Styles (Text Styles)

Figma Stylesは、デザイントークン(Variables)の上位レイヤーで、複数のプロパティを組み合わせた再利用可能なスタイル定義です。

### スタイルの種類

#### Typography Styles

- **Body Base**: 標準的な本文テキスト
  - Font: Inter Regular 16px
  - Weight: 400
  - Line Height: 1.4

- **Body Base Single Line**: 行間なしの本文テキスト
  - Font: Inter Regular 16px
  - Weight: 400
  - Line Height: 1.0

- **Body Small**: 小さめの本文テキスト
  - Font: Inter Regular 14px
  - Weight: 400
  - Line Height: 1.4

- **Body Strong**: 太字の本文テキスト
  - Font: Inter Semi Bold 16px
  - Weight: 600
  - Line Height: 1.4

- **Heading**: 見出しテキスト
  - Font: Inter Semi Bold 24px
  - Weight: 600
  - Line Height: 1.2

- **Subtitle**: サブタイトルテキスト
  - Font: Inter Regular 32px
  - Weight: 400
  - Line Height: 1.2

- **Title Hero**: ヒーロータイトル
  - Font: Inter Bold 72px
  - Weight: 700
  - Line Height: 1.2

### スタイルの使用方法

#### CSSクラスとして使用

`globals.css`で定義されたスタイルクラスを使用:

```tsx
<p className="text-body-base">標準的な本文テキスト</p>
<p className="text-body-small">小さめのテキスト</p>
<p className="text-body-strong">太字のテキスト</p>
<h1 className="text-title-hero">ヒーローセクションのタイトル</h1>
<h2 className="text-heading">見出し</h2>
<p className="text-subtitle">サブタイトル</p>
```

#### Tailwindユーティリティで個別に指定

```tsx
<p className="font-body text-body-medium font-body-regular leading-body">
  個別のプロパティを組み合わせる
</p>
```

#### 組み合わせ例

```tsx
<div className="text-body-base text-text-default">
  スタイル + カラーの組み合わせ
</div>

<h1 className="text-title-hero text-text-brand-on-brand bg-background-brand">
  ブランドカラーのヒーロータイトル
</h1>
```

### Variables vs Styles の使い分け

- **Variables**: 個々のプロパティ値（色、サイズ、フォントウェイトなど）
  - `text-text-default` (色)
  - `p-400` (padding)
  - `rounded-200` (border radius)

- **Styles**: 複数のプロパティを組み合わせた完成形
  - `text-body-base` (font-family + font-size + font-weight + line-height)
  - `text-heading` (font-family + font-size + font-weight + line-height)

**推奨される使い方:**
```tsx
// ✅ Good: StylesとVariablesを組み合わせる
<p className="text-body-base text-text-default-secondary">
  セカンダリカラーの本文テキスト
</p>

// ❌ Avoid: すべて個別に指定する
<p className="font-body text-body-medium font-body-regular leading-body text-text-default-secondary">
  冗長な指定
</p>
```

## 関連ファイル

- `design-tokens/figma-variables.json` - 構造化されたデザイントークン（Variables）
- `design-tokens/figma-styles.json` - 構造化されたデザインスタイル（Styles）
- `app/globals.css` - CSS変数定義 + スタイルクラス定義
- `tailwind.config.ts` - Tailwind設定
- `doc/figma_import.md` - Figmaインポート全般のドキュメント
