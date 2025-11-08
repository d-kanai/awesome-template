# Figma命名規則

このプロジェクトでは、Figmaのデザイントークンを自動的にコードに変換します。
**Figmaでの命名が、そのままコード内のクラス名や変数名になります。**

## 命名ルール概要

| 項目 | 区切り文字 | 例 | 用途 |
|------|----------|-----|------|
| **Variables** | `/` スラッシュ | `Background/Default/Default` | 階層構造 |
| **Styles** | `-` ハイフン | `title-hero` | CSSクラス名 |
| **Components** | `/` スラッシュ | `Button/StateDefault` | 階層構造 |

**なぜ統一できないのか？**
- Variables/Components: 階層構造を表現するため`/`が必要
- Styles: フラットなCSSクラス名として使うため`-`が最適

## 詳細ルール

### 1. Variables（変数）

階層構造はスラッシュ区切りを使用してください（Figmaの標準）。

```
✅ 推奨: Background/Default/Default
✅ 推奨: Text/Brand/Default
```

生成されるTailwindクラス:
```tsx
className="bg-sds_light-Background-Default-Default"
className="text-sds_light-Text-Brand-Default"
```

### 2. Styles（スタイル）

**ハイフン区切り（kebab-case）で命名してください。**

```
❌ 避ける: Title Hero        (スペース区切り)
❌ 避ける: Title_Hero        (アンダースコア)
❌ 避ける: TitleHero         (キャメルケース)
✅ 推奨:   title-hero        (ハイフン区切り)
```

生成されるCSSクラス:
```tsx
className="text-title-hero"
className="text-body-base"
className="text-heading"
```

**理由**: Figmaの名前がそのままCSSクラス名になります。変換ロジックによる衝突を避けるため、最初からハイフン区切りで命名してください。

#### Text Styles 命名例
```
✅ title-hero
✅ title-page
✅ heading
✅ subheading
✅ subtitle
✅ body-base
✅ body-small
✅ body-strong
✅ body-small-strong
✅ single-line-body-base
```

#### Color Styles 命名例
```
✅ image-placeholder
✅ overlay-background
```

#### Effect Styles 命名例
```
✅ drop-shadow-100
✅ drop-shadow-200
✅ inner-shadow-100
✅ blur-glass
```

### 3. Components（コンポーネント）

階層はスラッシュ区切り、プロパティはPascalCaseで命名してください。

```
❌ 避ける: Button/State=Default    (等号を含む)
❌ 避ける: Button/state-default    (小文字)
✅ 推奨:   Button/StateDefault     (PascalCase)
```

生成されるコンポーネント:
```tsx
import { ButtonStateDefault } from "@/features/shared/figma_generated/ButtonStateDefault"
```

## 確認方法

### スクリプト実行時の警告

Styles生成時にスペースを含む名前があると警告が表示されます：

```bash
pnpm run figma:generate:styles

⚠️  Style name contains spaces: "Title Hero" - Consider using kebab-case in Figma
```

この警告が出た場合は、Figmaのスタイル名をハイフン区切りに変更してください。

## 同期コマンド

Figmaで命名を変更した後、以下のコマンドで再生成してください：

```bash
# Variables
pnpm run figma:sync:tokens

# Styles
pnpm run figma:sync:styles

# Components
pnpm run figma:sync:components

# 全て
pnpm run figma:sync:tokens && pnpm run figma:sync:styles && pnpm run figma:sync:components
```

## デザイナーへの共有事項

1. **Styles（テキスト・カラー・エフェクト）**: ハイフン区切りで命名
   - 例: `title-hero`, `body-base`, `drop-shadow-300`

2. **Variables（色・サイズ）**: スラッシュ区切りでOK（従来通り）
   - 例: `Background/Default/Default`

3. **Components**: スラッシュとPascalCaseの組み合わせ
   - 例: `Button/StateDefault`, `Card/SizeLarge`

4. 命名変更後は開発チームに通知し、`figma:sync`コマンドを実行してもらう
