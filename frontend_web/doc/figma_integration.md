# Figma Integration - 完全自動化フロー

Figma REST APIからデザイントークン・スタイル・コンポーネントを完全自動で取得し、TypeScript/React/CSSに変換する仕組みを説明します。

## 📋 目次

1. [Variables (デザイントークン)](#-1-variables-デザイントークン)
2. [Styles (テキスト・色・エフェクト)](#-2-styles-テキスト色エフェクト)
3. [Components (UIコンポーネント)](#-3-components-uiコンポーネント)

---

## 🎨 1. Variables (デザイントークン)

**目的**: Figmaで定義した色・スペーシング・タイポグラフィ変数をTailwind CSS変数に変換

### 📡 使用API

```
GET https://api.figma.com/v1/files/{fileKey}/variables/local
```

**レスポンス例**:
```json
{
  "meta": {
    "variableCollections": {
      "VariableCollectionId:123": {
        "name": "Colors",
        "modes": [{"modeId": "456", "name": "Light"}]
      }
    },
    "variables": {
      "VariableID:789": {
        "name": "Background/Default/Default",
        "resolvedType": "COLOR",
        "valuesByMode": {
          "456": {"r": 1, "g": 1, "b": 1, "a": 1}
        }
      }
    }
  }
}
```

### 🔄 変換フロー

```
📡 Figma Variables API
    ↓
💾 design-tokens/raw/figma-variables-raw.json (生データ保存)
    ↓
🔧 変換処理 (scripts/generate-design-tokens.ts)
    ├─ 色変数 → RGB値を16進数に変換
    ├─ 階層構造 ("Background/Default/Default") → ネストオブジェクト
    └─ Tailwind設定形式に変換
    ↓
💾 design-tokens/figma-raw.json (中間形式)
    ↓
🎨 CSS Variables生成 (Tailwind設定)
    ↓
✅ tailwind.config.ts に統合
    ↓
🎯 使用可能: bg-background, text-foreground など
```

### 📝 スクリプト

| スクリプト | 役割 |
|-----------|------|
| `pnpm run figma:fetch:variables` | Variables API呼び出し → raw保存 |
| `pnpm run figma:generate:tokens` | raw → Tailwind形式変換 |

### 🎯 出力例

**Figma**: `Background/Default/Default` = `#FFFFFF`

**Tailwind設定**:
```javascript
colors: {
  background: {
    DEFAULT: '#FFFFFF'
  }
}
```

**使用**:
```tsx
<div className="bg-background">...</div>
```

---

## 🎭 2. Styles (テキスト・色・エフェクト)

**目的**: Figmaで定義したText Style、Color Style、Effect StyleをCSS classに変換

### 📡 使用API

#### 2-1. Styles一覧取得
```
GET https://api.figma.com/v1/files/{fileKey}/styles
```

**レスポンス例**:
```json
{
  "meta": {
    "styles": [
      {
        "key": "abc123",
        "name": "Single Line/Body Base",
        "node_id": "56:9001",
        "style_type": "TEXT"
      }
    ]
  }
}
```

#### 2-2. Style詳細取得（ノード情報）
```
GET https://api.figma.com/v1/files/{fileKey}/nodes?ids=56:9001
```

**レスポンス例**:
```json
{
  "nodes": {
    "56:9001": {
      "document": {
        "style": {
          "fontFamily": "Inter",
          "fontSize": 16,
          "fontWeight": 400,
          "lineHeightPx": 16
        }
      }
    }
  }
}
```

### 🔄 変換フロー

```
📡 Figma Styles API
    ↓
💾 design-tokens/raw/figma-styles-raw.json
    ├─ stylesResponse (Styles一覧)
    └─ nodesResponse (各StyleのNode詳細)
    ↓
🔧 変換処理 (scripts/figma/generate-styles.ts)
    │
    ├─ 📝 Text Styles
    │   ├─ Style名 "Single Line/Body Base" → toKebabCase()
    │   ├─ "single-line-body-base" → CSSクラス名
    │   └─ fontFamily, fontSize, fontWeight → CSS properties
    │
    ├─ 🎨 Color Styles
    │   ├─ Color値 → CSS変数
    │   └─ --color-{name}: rgba(...)
    │
    └─ ✨ Effect Styles
        ├─ Shadow定義 → CSS変数
        └─ --shadow-{name}: 0px 4px 8px rgba(...)
    ↓
💾 design-tokens/figma-styles.json (中間形式)
    ↓
📄 styles/figma/figma-styles.css 生成
    ↓
✅ app/globals.css に @import
    ↓
🎯 使用可能: .text-single-line-body-base, .shadow-card など
```

### 📝 スクリプト

| スクリプト | 役割 |
|-----------|------|
| `pnpm run figma:fetch:styles` | Styles API + Nodes API呼び出し |
| `pnpm run figma:generate:styles` | CSS生成 |

### 🎯 出力例

**Figma**: Text Style "Single Line/Body Base" (16px, Inter, 400)

**CSS**:
```css
/* Single Line/Body Base */
.text-single-line-body-base {
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
}
```

**使用**:
```tsx
<p className="text-single-line-body-base">Text</p>
```

---

## 🧩 3. Components (UIコンポーネント)

**目的**: FigmaのCOMPONENT_SETからプロパティ定義・使用Style・使用Variableを自動検出し、TypeScript/Reactコンポーネントを生成

### 📡 使用API（3つのAPIを組み合わせ）

#### 3-1. ファイル全体取得（COMPONENT_SET探索）
```
GET https://api.figma.com/v1/files/{fileKey}
```

**目的**: COMPONENT_SET型のノードを再帰探索

**レスポンス例**:
```json
{
  "document": {
    "type": "DOCUMENT",
    "children": [
      {
        "type": "COMPONENT_SET",
        "id": "123:456",
        "name": "Button",
        "componentPropertyDefinitions": {
          "Variant": {
            "type": "VARIANT",
            "variantOptions": ["Primary", "Neutral", "Subtle"]
          },
          "Label#2:0": {
            "type": "TEXT",
            "defaultValue": "Button"
          },
          "Has Icon Start#4:128": {
            "type": "BOOLEAN",
            "defaultValue": false
          }
        },
        "children": [
          {"type": "COMPONENT", "id": "123:457", "name": "Variant=Primary, State=Default"}
        ]
      }
    ]
  }
}
```

#### 3-2. コンポーネント一覧取得
```
GET https://api.figma.com/v1/files/{fileKey}/components
```

**レスポンス例**:
```json
{
  "meta": {
    "components": [
      {
        "key": "abc123",
        "name": "Variant=Primary, State=Default, Size=Medium",
        "node_id": "123:457",
        "containing_frame": {
          "pageName": "Buttons"
        }
      }
    ]
  }
}
```

#### 3-3. ノード詳細取得（depth=2で子ノードも取得）
```
GET https://api.figma.com/v1/files/{fileKey}/nodes?ids=123:457&depth=2
```

**目的**: 子ノード（TEXTノードなど）からStyle情報を取得

**レスポンス例**:
```json
{
  "nodes": {
    "123:457": {
      "document": {
        "type": "COMPONENT",
        "id": "123:457",
        "fills": [
          {
            "type": "SOLID",
            "boundVariables": {
              "color": {
                "type": "VARIABLE_ALIAS",
                "id": "VariableID:3919:36428"
              }
            }
          }
        ],
        "children": [
          {
            "type": "TEXT",
            "styles": {
              "text": "56:9001"
            }
          }
        ]
      }
    }
  }
}
```

### 🔄 変換フロー

```
1️⃣ 📡 GET /files/{fileKey}
    ↓
    🔍 再帰探索: COMPONENT_SET型ノードを検出
    ↓
    📊 357個のCOMPONENT_SET発見
    ├─ componentPropertyDefinitions 抽出
    │   ├─ VARIANT型: Variant, State, Size
    │   ├─ TEXT型: Label
    │   ├─ BOOLEAN型: Has Icon Start/End
    │   └─ INSTANCE_SWAP型: Icon Start/End
    └─ 子ノードマッピング
        └─ COMPONENT (バリアント) → 親COMPONENT_SETの対応表作成
    ↓
2️⃣ 📡 GET /files/{fileKey}/components
    ↓
    📋 471個のCOMPONENT（バリアント）取得
    ├─ name: "Variant=Primary, State=Default, Size=Medium"
    ├─ node_id: "123:457"
    └─ pageName: "Buttons"
    ↓
3️⃣ 📡 GET /files/{fileKey}/nodes?ids=...&depth=2
    │  (100個ずつバッチ処理 × 5回)
    ↓
    🔍 各COMPONENTから情報抽出
    │
    ├─ 🎭 Style情報（子ノードから）
    │   ├─ 再帰的に子ノードを探索
    │   ├─ styles.text: "56:9001" (Text Style ID)
    │   ├─ styles.fill: (Fill Style ID)
    │   └─ styles.effect: (Effect Style ID)
    │
    ├─ 🎨 Variable情報
    │   ├─ fills[0].boundVariables.color.id
    │   │   → "VariableID:3919:36428"
    │   └─ strokes[0].boundVariables.color.id
    │       → "VariableID:3919:36516"
    │
    └─ 📝 プロパティ情報
        └─ 親COMPONENT_SETの componentPropertyDefinitions を紐付け
    ↓
💾 design-tokens/raw/figma-components-raw.json
    ├─ componentsResponse (コンポーネント一覧)
    ├─ componentInfos (各コンポーネント詳細)
    │   ├─ name
    │   ├─ componentSetProperties (プロパティ定義)
    │   └─ styleInfo
    │       ├─ fills (Variable ID含む)
    │       ├─ strokes (Variable ID含む)
    │       └─ usedStyles
    │           ├─ textStyles: ["56:9001"]
    │           ├─ fillStyles: []
    │           └─ effectStyles: []
    └─ fileResponse (COMPONENT_SET情報)
    ↓
💾 design-tokens/figma-components.json (処理済み)
    ↓
🔧 コンポーネント生成 (scripts/figma/generate-components.ts)
    │
    ├─ 📝 TypeScript型定義生成
    │   ├─ VARIANT型 → Union型
    │   │   variant: "primary" | "neutral" | "subtle"
    │   ├─ TEXT型 → string props
    │   │   label?: string
    │   └─ BOOLEAN型 → boolean props
    │       hasIconStart?: boolean
    │
    ├─ 🎨 CVA設定生成
    │   └─ VARIANT型の選択肢 → variants オブジェクト
    │
    └─ 🎭 Style適用
        ├─ usedStyles.textStyles[0] を解決
        │   "56:9001" → figma-styles.json で検索
        │   → "Single Line/Body Base"
        │   → CSS: "text-single-line-body-base"
        │
        └─ boundVariables.color.id からVariable参照
            → Tailwind変数使用 (bg-primary など)
    ↓
📄 features/shared/figma_generated/ButtonNew.tsx
    ↓
✅ Reactコンポーネントとして使用可能
```

### 📊 API呼び出し回数

**合計7回**（471コンポーネント取得の場合）:

| API | 回数 | 目的 |
|-----|------|------|
| `GET /files/{key}` | 1回 | COMPONENT_SET探索 |
| `GET /files/{key}/components` | 1回 | コンポーネント一覧 |
| `GET /files/{key}/nodes?depth=2` | 5回 | ノード詳細（100個ずつバッチ） |

### 📝 スクリプト

| スクリプト | 役割 |
|-----------|------|
| `pnpm run figma:fetch:components` | 3つのAPI呼び出し → raw保存 |
| `pnpm run figma:generate:components` | TypeScript/Reactコード生成 |

### 🎯 出力例

**Figma COMPONENT_SET**: "Button"
- Variant: Primary | Neutral | Subtle
- Size: Medium | Small
- Label: "Button" (TEXT)
- Has Icon Start: false (BOOLEAN)

**検出された情報**:
- Text Style: "Single Line/Body Base" (56:9001)
- Primary Fill Variable: VariableID:3919:36428
- Primary Stroke Variable: VariableID:3919:36516

**生成されるコード**:
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center text-single-line-body-base ...",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        neutral: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        subtle: "bg-background text-foreground hover:bg-background-secondary",
      },
      size: {
        medium: "h-10 px-Space-400 py-Space-200",
        small: "h-9 px-Space-300 py-Space-150",
      },
    },
  }
);

export interface ButtonNewProps {
  variant?: "primary" | "neutral" | "subtle";
  size?: "medium" | "small";
  label?: string;
  hasIconStart?: boolean;
  hasIconEnd?: boolean;
}
```

**使用**:
```tsx
<ButtonNew variant="primary" size="medium" label="Click me" />
```

---

## 🔍 重要ポイント

### ✅ 完全自動化されている項目

| 項目 | 自動検出方法 |
|------|------------|
| ✅ コンポーネントプロパティ定義 | COMPONENT_SET.componentPropertyDefinitions |
| ✅ 使用Text Style | 子ノード探索 → styles.text |
| ✅ 使用Color Variable | fills/strokes.boundVariables.color.id |
| ✅ プロパティ型 (VARIANT/TEXT/BOOLEAN) | componentPropertyDefinitions.type |
| ✅ デフォルト値 | componentPropertyDefinitions.defaultValue |
| ✅ バリアント選択肢 | componentPropertyDefinitions.variantOptions |

### 🎨 Style ID → CSS Class 名前解決

```
Text Style ID (56:9001)
    ↓
figma-styles.json で nodeId検索
    ↓
name: "Single Line/Body Base"
    ↓
toKebabCase()
    ↓
CSS class: .text-single-line-body-base
```

### 🔗 Variable ID → Tailwind Class 名前解決

```
Variable ID (VariableID:3919:36428)
    ↓
figma-raw.json (design tokens) で検索
    ↓
name: "Background/Brand/Default"
    ↓
Tailwind config
    ↓
class: bg-brand-default
```

---

## 📁 ファイル構造

```
frontend_web/
├─ scripts/
│  ├─ figma/
│  │  ├─ fetch-styles.ts        # 📡 Styles API呼び出し
│  │  ├─ generate-styles.ts     # 🔧 CSS生成
│  │  ├─ fetch-components.ts    # 📡 Components API呼び出し (3つのAPI)
│  │  └─ generate-components.ts # 🔧 TypeScript/React生成
│  └─ generate-design-tokens.ts # 🔧 Variables → Tailwind変換
│
├─ design-tokens/
│  ├─ raw/                      # 💾 生データ保存
│  │  ├─ figma-styles-raw.json
│  │  └─ figma-components-raw.json (7.7MB - 471コンポーネント)
│  ├─ figma-raw.json            # 🎨 Variables中間形式
│  ├─ figma-styles.json         # 🎭 Styles中間形式
│  └─ figma-components.json     # 🧩 Components中間形式
│
├─ styles/figma/
│  └─ figma-styles.css          # 📄 生成CSS
│
└─ features/shared/figma_generated/
   └─ ButtonNew.tsx             # 🧩 生成コンポーネント
```

---

## 🚀 実行順序

```bash
# 1. Variables取得・変換
pnpm run figma:fetch:variables
pnpm run figma:generate:tokens

# 2. Styles取得・変換
pnpm run figma:fetch:styles
pnpm run figma:generate:styles

# 3. Components取得・変換
pnpm run figma:fetch:components
pnpm run figma:generate:components
```

または一括実行:
```bash
pnpm run figma:sync  # 全て実行
```

---

## 💡 命名規則

### Figma → CSS/Tailwind 変換ルール

| Figma | 変換関数 | 出力例 |
|-------|---------|--------|
| `Title/Hero` | toKebabCase() | `.text-title-hero` |
| `Background/Default/Default` | 階層構造維持 | `bg.background.DEFAULT` |
| `Single Line/Body Base` | toKebabCase() | `.text-single-line-body-base` |
| スペース区切り | `-` に変換 | ✅ |
| `/` 区切り | `-` に変換（Styles）/ 階層（Variables） | ✅ |

---

## 🎯 まとめ

| 種類 | API数 | 変換ステップ | 出力 |
|------|-------|------------|------|
| **Variables** | 1個 | 2ステップ | Tailwind設定 |
| **Styles** | 2個 | 2ステップ | CSS file |
| **Components** | 3個 | 3ステップ | TypeScript/React |

**すべて自動化**:
- ✅ プロパティ定義
- ✅ 使用Style検出
- ✅ 使用Variable検出
- ✅ TypeScript型生成
- ✅ CSS class生成
- ✅ React component生成

**手動作業**: ゼロ 🎉
