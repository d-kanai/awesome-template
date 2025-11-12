# Figma Component Import Guide

このドキュメントは、Figma Desktop MCPを使用してFigmaデザインからコンポーネントを実装するための具体的なプロセスとガイドラインを記載しています。

**コーディング規約（一般的なルールやベストプラクティス）については `code_rule.md` を参照してください。**

## ドキュメントの棲み分け

- **`code_rule.md`**: コーディング規約全般
  - 一般的なコーディングルール（命名規則、ディレクトリ構造、React/TypeScriptのベストプラクティス）
  - CSS・デザイントークンの使用方法
  - テスト仕様（UT、E2E）
  - フォーム実装規約
  - すべてのコンポーネント（Figma由来でないものも含む）に適用されるルール

- **`figma_import.md`**（このドキュメント）: Figmaコンポーネント取り込み専用
  - Figma Desktop MCPツールの使用方法
  - Figmaからコンポーネントを実装するための具体的な手順
  - Atomic Designに基づくコンポーネント構築戦略
  - Figmaデータの解釈と調整方法
  - Figma特有の問題とその対処法

## コンポーネント取り込みの基本方針

1. **MCPツールを使用**: Figma Desktop MCPの`get_design_context`と`get_screenshot`を使用してコンポーネント・ページを取得すること
2. **Atomic Designの順序**: 小さいコンポーネントから大きいコンポーネント、そしてページへ段階的に実装すること
   - Atoms → Molecules → Organisms → Templates → Pages
   - 例: Button → ButtonGroup → HeroActions → HomePage
3. **コンポーネントの合成**: 既存の小さいコンポーネントを組み合わせて大きいコンポーネント・ページを構築すること
   - 例: TestimonialCard = TextContentHeading + AvatarBlock
   - 例: Footer = FooterLinkSection, FooterLinkSection = TextLinkListItem
   - 例: HomePage = Header + HeroActions + CardGridTestimonials + Footer
4. **レスポンシブ対応**: FigmaにDesktop版とMobile版が存在する場合、Tailwindレスポンシブクラスで実装すること
   - Figmaの`platform` propパターンは`.figma-raw.tsx`にのみ保持（参照用）
   - 実装ファイル（`.tsx`）では`platform` propを使わず、Tailwindの`md:`ブレークポイント（768px）で自動切り替え
   - Mobile First: デフォルトスタイルがMobile、`md:`プレフィックスでDesktop
   - 例: `hidden md:flex` (Mobile非表示、Desktop表示), `flex md:hidden` (Mobile表示、Desktop非表示)

## 実装手順

### 1. 個別コンポーネントノードを取得

- Figmaで実装するコンポーネント名を検索し、node IDを特定
- `get_design_context(nodeId)`でデザインコンテキストを取得
- `get_screenshot(nodeId)`でビジュアルを確認

### 2. 既存コンポーネントの確認

- 取得したデザインコンテキストに含まれる子コンポーネントが既に実装済みか確認
- 未実装の場合は、依存する子コンポーネントから先に実装

### 3. コンポーネント実装

#### ディレクトリ構造

コンポーネントの種類に応じて適切な場所に配置:

**Atoms** (単一コンポーネント、他に依存しない):
- Figma生データ: `features/shared/ui/figma_generated/atoms/[ComponentName]/`
  - `[ComponentName].figma-raw.tsx`: Figma純正版（差分比較用のみ）
- 実装: `features/shared/ui/atoms/[ComponentName]/`
  - `[ComponentName].tsx`: 実装版（forwardRef、onClick等）
  - `[ComponentName].stories.tsx`: Storybookストーリー
  - `[ComponentName].figma.tsx`: Code Connect
  - `index.tsx`: エクスポート定義

**Components** (複数コンポーネント組み合わせ):
- Figma生データ: `features/shared/ui/figma_generated/components/[ComponentName]/`
  - `[ComponentName].figma-raw.tsx`: Figma純正版（差分比較用のみ）
- 実装: `features/shared/ui/components/[ComponentName]/`
  - `[ComponentName].tsx`: 実装版
  - `[ComponentName].stories.tsx`: Storybookストーリー
  - `[ComponentName].figma.tsx`: Code Connect
  - `index.tsx`: エクスポート定義

**Pages** (最上位、app routerのpageに対応):
- Figma生データ: `features/shared/ui/figma_generated/pages/[PageName]/`
  - `[PageName].figma-raw.tsx`: Figma純正版（参考用のみ）
- 実装: `features/[feature]/screens/[ScreenName].tsx`
  - 例: `features/home/screens/HomeScreen.tsx`

**重要**:
- `figma_generated`はFigmaから取得した生データ(`.figma-raw.tsx`)のみを保管
- 実装ファイル(`.tsx`, `.stories.tsx`, `.figma.tsx`)は全て`ui/atoms`または`ui/components`に配置
- 双方向の参照を維持するため、ファイルヘッダーにパスを記載:

```typescript
// features/shared/ui/figma_generated/atoms/Button/Button.figma-raw.tsx
/**
 * ============================================
 * 🎨 Button (Figma Raw)
 * 📅 Generated at: 2025-11-09 21:30 JST
 * 🔗 Node ID: 123-456
 * 🔗 Figma URL: https://...
 * 📍 Implementation: features/shared/ui/atoms/Button/Button.tsx
 * ============================================
 */
```

```typescript
// features/shared/ui/atoms/Button/Button.tsx
/**
 * ============================================
 * 🎨 Button
 * 📅 Synced at: 2025-11-09 21:30 JST
 * 🔗 Figma Raw: features/shared/ui/figma_generated/atoms/Button/Button.figma-raw.tsx
 * ============================================
 */
```

#### タイムスタンプのラベル規約

ファイルの種類によってタイムスタンプのラベルを使い分けること:

- **Figma Raw files** (`figma_generated/**/*.figma-raw.tsx`):
  - `📅 Generated at: YYYY-MM-DD HH:mm JST`
  - Figmaから生成された読み取り専用の参照ファイルであることを示す
  - 差分比較用の純粋なFigma出力として保持

- **Implementation files** (`ui/atoms/**/*.tsx`, `ui/components/**/*.tsx`, `app/**/*.tsx`):
  - `📅 Synced at: YYYY-MM-DD HH:mm JST`
  - Figmaデザインと最後に同期した日時を示す
  - 実装側で継続的にメンテナンスされるファイルであることを強調

**理由**:
- "Generated" = 自動生成された静的なファイル（変更しない）
- "Synced" = Figmaと同期しながら継続的に更新されるファイル（カスタマイズが含まれる）

### 4. 既存コンポーネントで置き換え

- Figmaのデザインコンテキストに含まれる既存コンポーネントは、手動実装でなく既存コンポーネントをインポートして使用
- 例: Avatar, Button, TextContentHeadingなど

### 5. 型安全性の確認

- `pnpm typecheck`を実行してTypeScriptエラーがないことを確認
- 必要な型のエクスポートを`index.tsx`に追加

### 6. Storybookファイル作成

- `*.stories.tsx`ファイルには**必ず**`import React from "react";`を含めること
  - Storybookの実行環境でReactが未定義エラーになるため必須
  - 例: `import type { Meta, StoryObj } from "@storybook/react";` の後に `import React from "react";` を追加
- 全てのバリエーション（variant、size、state等）をストーリーとして作成すること

## Figmaデータの解釈と調整

### 1. Figma定義と実際の使用方法の矛盾

- Figmaのコンポーネント定義が実際のページでの使用方法と異なる場合がある
- 例: 固定幅で定義されているが、実際は可変幅で使われている
- 矛盾がある場合は、アクションを確認

### 2. スクリーンショットとの照合

- `get_screenshot`で取得したビジュアルと`get_design_context`のコードを照らし合わせる
- 矛盾がある場合は、アクションを確認

### 3. コンポーネントの粒度調整

- Figmaで1つの大きなコンポーネントとして定義されていても、実装時に適切な粒度で分割
- 例: FooterLinkSection内のリンクアイテムをTextLinkListItemとして独立

## デザイントークンの使用

- Figmaからコンポーネントを実装する際は、必ずFigmaのsemantic tokensを使用すること
- Tailwindのユーティリティクラス（`gap-2`, `px-3`, `rounded-lg`など）ではなく、Figma design tokensを使用すること
  - 例: `gap-2` → `gap-[var(--sds-size-space-200,8px)]`
  - 例: `px-3 py-3` → `p-[var(--sds-size-space-300,12px)]`
  - 例: `rounded-lg` → `rounded-[var(--sds-size-radius-200,8px)]`
  - 例: `border` → `border-[var(--sds-size-stroke-border,1px)]`
  - 例: `text-base font-normal` → `font-[family-name:var(--sds-typography-body-font-family)] font-[var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]`
- **重要**: Tailwind arbitrary valuesでは、プロパティの種類を明示的に指定すること
  - border-widthの場合: `border-[length:var(--sds-size-stroke-border,1px)]`
  - border-colorの場合: `border-[color:var(--sds-color-border-default-default,#d9d9d9)]`
  - text-colorの場合: `text-[color:var(--sds-color-text-default-default,#1e1e1e)]`
  - font-sizeの場合: `text-[length:var(--sds-typography-body-size-medium,16px)]`
  - 理由: Tailwindは`border-[var(...)]`を自動的に`border-color`として解釈するため、border-widthやfont-sizeなど他のプロパティには明示的な型指定が必要
- 理由: Figmaでデザイントークンの値が変更された際、CSS変数を更新するだけで全コンポーネントに反映される（コンポーネントコードの変更不要）
- MCPの`get_design_context`で取得したコードを参考に、正確なtoken名を使用すること

## 実装例

### 1. Atomic Component（TextLinkListItem）

小さな独立したコンポーネント。他のコンポーネントに依存しない。

```typescript
// TextLinkListItem.tsx
"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface TextLinkListItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  className?: string;
}

export const TextLinkListItem = forwardRef<HTMLButtonElement, TextLinkListItemProps>(
  ({ text = "List item", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex flex-col justify-center",
          "font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)]",
          "font-[var(--sds-typography-body-font-weight-regular,400)]",
          "text-[length:var(--sds-typography-body-size-medium,16px)]",
          "leading-[0]",
          "text-[color:var(--sds-color-text-default-default,#1e1e1e)]",
          "text-left",
          className,
        )}
        {...props}
      >
        <p className="leading-[1.4] whitespace-pre">{text}</p>
      </button>
    );
  },
);

TextLinkListItem.displayName = "TextLinkListItem";
```

### 2. Molecular Component（FooterLinkSection）

Atomicコンポーネントを組み合わせた中規模コンポーネント。

```typescript
// FooterLinkSection.tsx
"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { TextLinkListItem } from "../TextLinkListItem";

export interface FooterLinkItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface FooterLinkSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  links?: FooterLinkItem[];
  className?: string;
}

export const FooterLinkSection = forwardRef<HTMLDivElement, FooterLinkSectionProps>(
  ({ title = "Text Strong", links = [], className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-start content-stretch",
          "gap-[var(--sds-size-space-300,12px)]",
          className,
        )}
        {...props}
      >
        {/* Title */}
        <div className="flex flex-col items-start content-stretch gap-[10px] pb-[var(--sds-size-space-400,16px)] pt-0 px-0 w-full">
          <div className="flex items-start content-stretch w-full">
            <p
              className={cn(
                "font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)]",
                "font-[var(--sds-typography-body-font-weight-strong,600)]",
                "text-[length:var(--sds-typography-body-size-medium,16px)]",
                "leading-[1.4]",
                "text-[color:var(--sds-color-text-default-default,#1e1e1e)]",
                "text-nowrap whitespace-pre",
              )}
            >
              {title}
            </p>
          </div>
        </div>

        {/* Links - 既存のTextLinkListItemを使用 */}
        {links.map((link, index) => (
          <TextLinkListItem key={index} text={link.label} onClick={link.onClick} />
        ))}
      </div>
    );
  },
);

FooterLinkSection.displayName = "FooterLinkSection";
```

### 3. Organism Component（CardGridTestimonials）

複数のMolecularコンポーネントを組み合わせた大規模コンポーネント。

```typescript
// CardGridTestimonials.tsx
"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { TextContentHeading } from "../TextContentHeading";
import { TestimonialCard } from "../TestimonialCard";

export type CardGridTestimonialsPlatform = "Desktop" | "Mobile";

export interface Testimonial {
  quote: string;
  title: string;
  description: string;
  avatarSrc?: string;
  avatarAlt?: string;
}

export interface CardGridTestimonialsProps extends React.HTMLAttributes<HTMLElement> {
  platform?: CardGridTestimonialsPlatform;
  heading?: string;
  subheading?: string;
  hasSubheading?: boolean;
  testimonials?: Testimonial[];
  className?: string;
}

export const CardGridTestimonials = forwardRef<HTMLElement, CardGridTestimonialsProps>(
  (
    {
      platform = "Desktop",
      heading = "What Our Customers Say",
      subheading = "Trusted by teams worldwide",
      hasSubheading = true,
      testimonials = [],
      className,
      ...props
    },
    ref,
  ) => {
    // Platform-specific layout classes
    const containerClasses = {
      Desktop: cn(
        "w-[1200px]",
        "px-[var(--sds-size-space-1600,64px)]",
        "py-[var(--sds-size-space-1600,64px)]",
      ),
      Mobile: cn(
        "w-[375px]",
        "px-[var(--sds-size-space-600,24px)]",
        "py-[var(--sds-size-space-600,24px)]",
      ),
    }[platform];

    const gridClasses = {
      Desktop: cn(
        "grid grid-cols-3",
        "gap-[var(--sds-size-space-1200,48px)]",
      ),
      Mobile: cn(
        "flex flex-col",
        "gap-[var(--sds-size-space-600,24px)]",
      ),
    }[platform];

    return (
      <section
        ref={ref}
        className={cn(
          "flex flex-col items-center content-stretch",
          "gap-[var(--sds-size-space-1200,48px)]",
          "bg-[color:var(--sds-color-background-default-default,#ffffff)]",
          containerClasses,
          className,
        )}
        {...props}
      >
        {/* Text Content Heading - 既存コンポーネント使用 */}
        <TextContentHeading
          heading={heading}
          subheading={subheading}
          hasSubheading={hasSubheading}
          align="Start"
          className="w-full"
        />

        {/* Testimonial Cards Grid */}
        <div className={cn("w-full", gridClasses)}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              title={testimonial.title}
              description={testimonial.description}
              avatarSrc={testimonial.avatarSrc}
              avatarAlt={testimonial.avatarAlt}
            />
          ))}
        </div>
      </section>
    );
  },
);

CardGridTestimonials.displayName = "CardGridTestimonials";
```

### 4. Responsive Component（Header）

FigmaにDesktop版とMobile版が存在する場合の実装例。

```typescript
// Header.tsx
"use client";

import React, { useState } from "react";
import { cn } from "@/features/shared/lib/utils";
import { NavigationPillList } from "../NavigationPillList";
import { HeaderAuth } from "../HeaderAuth";

export interface HeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  navigationItems?: NavigationItem[];
  authState?: HeaderAuthState;
  // ❌ platform prop は削除（Figma rawにのみ存在）
  className?: string;
}

export function Header({
  logoSrc,
  logoAlt = "Logo",
  navigationItems = defaultNavigationItems,
  authState = "Logged Out",
  className,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Header Bar */}
      <header
        className={cn(
          "bg-[var(--sds-color-background-default-default,#ffffff)]",
          "border-[color:var(--sds-color-border-default-default,#d9d9d9)]",
          "border-b",
          "w-full",
          className,
        )}
      >
        <div
          className={cn(
            "flex items-center",

            // Mobile (デフォルト)
            "justify-between",
            "p-[var(--sds-size-space-600,24px)]",

            // Desktop (md: 768px以上)
            "md:flex-wrap md:content-center",
            "md:gap-[var(--sds-size-space-600,24px)]",
            "md:p-[var(--sds-size-space-800,32px)]",
          )}
        >
          {/* Logo - 常に表示 */}
          <div className="flex items-center gap-[24px] shrink-0">
            {/* Logo content */}
          </div>

          {/* Navigation - Desktop only */}
          <NavigationPillList
            items={pillItems}
            className={cn(
              "hidden", // Mobile: 非表示
              "md:flex md:flex-1 md:justify-end", // Desktop: 表示
            )}
          />

          {/* Auth - Desktop only */}
          <HeaderAuth
            state={authState}
            className={cn(
              "hidden", // Mobile: 非表示
              "md:block", // Desktop: 表示
            )}
          />

          {/* Hamburger - Mobile only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden" // Desktop: 非表示
          >
            {/* Menu icon */}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Mobile only */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Menu content */}
        </div>
      )}
    </>
  );
}
```

**ポイント:**
- `platform` propは削除し、Tailwindの`md:`ブレークポイントで自動切り替え
- Mobile First: デフォルトがMobile、`md:`でDesktop
- `hidden md:flex`: Mobile非表示、Desktop表示
- `flex md:hidden`: Mobile表示、Desktop非表示

**Storybook:**
```typescript
// Header.stories.tsx
export const Desktop: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "responsive", // 1200px
    },
  },
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "mobile1", // 375px
    },
  },
};
```

## よくある問題と対処法

### 問題1: Figma定義と実際の見た目が異なる

**症状**: Figmaのコンポーネント定義では固定幅だが、実際のページでは可変幅で表示されている

**例**: TextLinkListItemが`w-[89px]`で定義されているが、実際は"Best practices"などの長いテキストが表示されている

**対処法**:
1. `get_screenshot`で実際の見た目を確認
2. 実際の見た目を優先して実装（可変幅にする）
3. Figma側の修正を提案

**実装例**:
```typescript
// ❌ Figmaの定義通り（固定幅）
<button className="w-[89px]">{text}</button>

// ✅ 実際の使用方法を優先（可変幅）
<button className="text-left">{text}</button>
```

### 問題2: コンポーネントの粒度が適切でない

**症状**: Figmaでは1つの大きなコンポーネントとして定義されているが、実装時に再利用性が低い

**対処法**:
1. コンポーネントを適切な粒度で分割
2. 分割したコンポーネントを個別に実装
3. 親コンポーネントで組み合わせる

**実装例**:
```typescript
// FooterLinkSectionを実装する際、内部のリンクアイテムをTextLinkListItemとして独立させる

// TextLinkListItem（独立コンポーネント）
export const TextLinkListItem = forwardRef<HTMLButtonElement, TextLinkListItemProps>(
  ({ text, ...props }, ref) => <button ref={ref} {...props}>{text}</button>
);

// FooterLinkSection（TextLinkListItemを使用）
export const FooterLinkSection = forwardRef<HTMLDivElement, FooterLinkSectionProps>(
  ({ links, ...props }, ref) => (
    <div ref={ref} {...props}>
      {links.map((link, i) => <TextLinkListItem key={i} text={link.label} />)}
    </div>
  )
);
```

### 問題3: デザイントークンの値が不明確

**症状**: どのトークンを使うべきか判断できない

**対処法**:
1. `get_design_context`で取得したコードを確認
2. コード内の`var(--sds-*)`形式のトークン名をそのまま使用
3. フォールバック値も含めて正確に転記

**実装例**:
```typescript
// ✅ get_design_contextから取得したトークンをそのまま使用
<div className="gap-[var(--sds-size-space-200,8px)]">

// ❌ 推測でトークン名を変更しない
<div className="gap-2">
```

### 問題4: 配置・レイアウトが意図と異なる

**症状**: TextContentHeadingが中央揃えになっているが、Figmaでは左揃え

**対処法**:
1. `get_design_context`のコードで`items-start`や`items-center`などの配置クラスを確認
2. Figmaの定義に従ってalignment propを設定
3. スクリーンショットで見た目を確認

**実装例**:
```typescript
// ❌ 間違った配置
<TextContentHeading align="Center" />

// ✅ Figmaの定義に従った配置（items-startの場合）
<TextContentHeading align="Start" />
```

## Figma更新時の差分同期ワークフロー

### ⚠️ 重要: 自動置換は禁止

Figmaが更新されたからといって、**コンポーネントファイルを自動的に削除・再生成してはいけません**。

**理由:**
- 既存の実装にカスタマイズが含まれている（forwardRef、onClick、型の拡張など）
- Figmaの変更が実装に影響しない場合もある（コメント変更のみなど）
- 意図しない破壊的変更を防ぐため

### 2ファイル管理方式による差分確認

#### ファイル構成

**Atoms**の場合:
```
features/shared/ui/
├── figma_generated/atoms/TextLinkListItem/
│   └── TextLinkListItem.figma-raw.tsx  # Figma純正版（比較用）
└── atoms/TextLinkListItem/
    ├── TextLinkListItem.tsx             # 実装版（プロダクション用）
    ├── TextLinkListItem.stories.tsx
    ├── TextLinkListItem.figma.tsx
    └── index.tsx
```

**Components**の場合:
```
features/shared/ui/
├── figma_generated/components/Footer/
│   └── Footer.figma-raw.tsx
└── components/Footer/
    ├── Footer.tsx
    ├── Footer.stories.tsx
    ├── Footer.figma.tsx
    └── index.tsx
```

#### 差分確認の手順

##### 1. Figmaから最新コードを取得してメモリ上で比較

```bash
# AIに依頼してFigmaの最新コードを取得＆比較
# "Update TextLinkListItem from Figma"
# → AIがMCPで取得し、メモリ上で既存の.figma-raw.tsxと比較
```

**重要事項:**
- 中間ファイル保存は不要（メモリ上で比較）
- 2ファイル方式により、`.figma-raw.tsx`同士の比較で正確な差分検出が可能
- classNameは常に改行版でフォーマット統一されている

##### 2. AIが差分を検出して報告

**差分がない場合:**
```markdown
✅ Figma側で変更なし - 更新不要
```

**差分がある場合:**
```markdown
## Figma側の変更

- padding: var(--sds-size-space-300,12px) → var(--sds-size-space-400,16px)
- border-radius: var(--sds-size-radius-200,8px) → var(--sds-size-radius-300,12px)

## 実装のカスタマイズ（保持すべき）

- ✅ forwardRef対応
- ✅ onClick等のイベントハンドラー
- ✅ ButtonHTMLAttributes継承
- ✅ button要素（Figmaはdiv）
- ✅ cn()使用

## 更新が必要な箇所

1. TextLinkListItem.tsx 行25: padding値を更新
2. TextLinkListItem.tsx 行30: border-radius値を更新
```

##### 3. 差分がある場合のみ更新作業

**重要: 必ず figma-raw → 実装 の順で更新すること**

**a. `.figma-raw.tsx`を最新版で更新**

```bash
# Writeツールで最新版を保存
# features/shared/ui/figma_generated/atoms/TextLinkListItem/TextLinkListItem.figma-raw.tsx
```

**b. git diff で figma-raw の差分を確認**

```bash
git diff features/shared/ui/figma_generated/atoms/TextLinkListItem/TextLinkListItem.figma-raw.tsx

# Figmaの純粋な変更内容を把握:
# - どのデザイントークンが変わったか
# - どのスタイルが追加/削除されたか
```

**c. 実装版を更新（カスタマイズを保持）**

```bash
# Editツールで該当箇所のみ更新
# features/shared/ui/atoms/TextLinkListItem/TextLinkListItem.tsx
#
# git diff で確認した変更内容を反映:
# - デザイントークンの値を更新
# - forwardRef、onClick等のカスタマイズは保持
```

**d. タイムスタンプ更新**

両ファイルのタイムスタンプを更新：

```typescript
// Figma Raw file
/**
 * 📅 Generated at: 2025-11-15 10:00 JST  // ← 更新日時
 */

// Implementation file
/**
 * 📅 Synced at: 2025-11-15 10:00 JST  // ← 更新日時
 */
```

**e. Git差分で最終検証**

```bash
git diff features/shared/ui/figma_generated/atoms/TextLinkListItem/
git diff features/shared/ui/atoms/TextLinkListItem/

# 以下を確認:
# - .figma-raw.tsx: Figmaの変更のみ（自動生成コード）
# - .tsx: デザイントークン値のみ更新、カスタマイズ（forwardRef等）は保持
```

### 更新フローのまとめ

```
Figma更新検出
    ↓
① figma-raw.tsx を最新版で更新
    ↓
② git diff で figma-raw.tsx の差分を確認
    ↓
③ 差分内容を理解（何が変わったか把握）
    ↓
④ 実装ファイル(.tsx)に差分を反映
    ↓
⑤ git diff で両ファイルを最終確認
```

この順序により：
- Figmaの純粋な変更を先に確認できる
- 実装時にカスタマイズ部分を誤って消すリスクが減る
- 差分理解ミスを防げる

### 更新判断のガイドライン

| Figma側の変更内容 | 実装への反映 |
|---|---|
| デザイントークン値の変更（色、サイズ、spacing） | ✅ 反映する |
| レイアウト構造の変更（flex → grid等） | ⚠️ 慎重に判断（既存の動作に影響ないか確認） |
| 固定サイズ → 可変サイズ | ✅ 反映する |
| 要素タイプの変更（div → button） | ❌ 保持（実装側の判断を優先） |
| テキスト内容の変更 | ⚠️ デフォルト値として反映 |

### 更新しない箇所（カスタマイズを保持）

以下は実装時に追加した機能なので、Figma更新時も**保持**する：

- forwardRef対応
- イベントハンドラー（onClick, onChange等）
- 型の拡張（HTMLAttributes継承等）
- "use client" ディレクティブ
- cn()によるclassName結合
- アクセシビリティ属性（aria-*等）

## チェックリスト

コンポーネント実装時には以下を確認すること:

- [ ] `get_design_context`と`get_screenshot`で仕様を確認した
- [ ] 依存する子コンポーネントを先に実装した（Atomic Designの順序）
- [ ] forwardRefパターンを使用している
- [ ] Figmaのデザイントークン（`--sds-*`）を使用している
- [ ] Tailwind arbitrary valuesでプロパティ型を明示している（`border-[length:...]`, `text-[color:...]`など）
- [ ] `index.tsx`で型を適切にエクスポートしている
- [ ] Storybookストーリーを作成した（`import React from "react";`を含む）
- [ ] `pnpm typecheck`が成功した
- [ ] 実際の見た目がFigmaスクリーンショットと一致している
- [ ] Figma定義と実際の使用方法に矛盾がある場合、実際の見た目を優先した
