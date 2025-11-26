# Figma Page Import Guide (Page Level)

このドキュメントは、Figma Desktop MCPを使用してFigmaデザインから**ページレベル**（Pages / Templates）を実装するための具体的なプロセスとガイドラインを記載しています。

**Component Level（Atoms / Molecules / Organisms）の取り込みについては `@awesome/design-system` リポジトリの `doc/figma_import_component.md` を参照してください。**

**コーディング規約（一般的なルールやベストプラクティス）については [`code_rule.md`](./code_rule.md) を参照してください。**

## 対象コンポーネント

- **Pages**: 最上位のページコンポーネント（HomeScreen, UserListScreenなど）
- **Templates**: ページのテンプレートコンポーネント

## Page Levelの特徴

| 特徴 | Component Level | Page Level |
|-----|-----------------|------------|
| 配置場所 | `@awesome/design-system` | `features/[feature]/screens/` |
| Figma Raw配置 | design-system内のコンポーネントフォルダ | `app/[route]/` に `page.tsx` の横 |
| API呼び出し | ❌ なし | ✅ あり（queries/actions） |
| テスト | Storybookのみ | Screen Tests (`.spec.tsx`) |
| forwardRef | ✅ 必須 | ⚠️ オプション |
| モックワークフロー | N/A | ✅ `api_mock_mode/` |
| Code Connect | design-systemで管理 | ❌ 不要（コンポーネント経由） |

## 基本方針

1. **コンポーネントは design-system から import** - `@awesome/design-system` を使用
2. **API統合**: バックエンド未実装でもAPI連携とテストを完成させる
3. **Server Components**: RSC（React Server Components）パターンを使用
4. **Screen Tests**: vi.mock()による統合テスト

## 実装手順

**重要**: ページ取り込み時は、必ずTodoWriteツールでタスクリストを作成し、進捗を可視化すること。

### プラン作成時の事前確認（必須）

プラン作成前に、以下を**必ず**確認すること：

1. **MCP情報の完全取得**
   - ✅ `get_design_context` でコード取得
   - ✅ `get_screenshot` でスクリーンショット取得
   - ✅ `get_code_connect_map` で既存コンポーネントのマッピング確認
   - ✅ `get_metadata` でノード構造確認

2. **既存ファイル・ディレクトリの確認**
   - ✅ `features/[feature]/routes.ts` の存在確認（なければ新規作成が必要）
   - ✅ `features/[feature]/` ディレクトリの存在確認（既存featureか新規か）
   - ✅ `public/images/[feature]/` の存在確認

3. **Code Connect情報の理解**
   - ✅ 既存コンポーネントは `@awesome/design-system` からimport
   - ✅ **Page Rawファイルは `app/[route]/` に page.tsx の横に作成**
   - ✅ 既存コンポーネント内に画像アセットが含まれているか確認
   - ✅ 含まれていない場合は `public/images/` にダウンロードが必要

4. **コンポーネントPropsインターフェースの事前確認**
   - ✅ 使用する共有コンポーネント（`@awesome/design-system`）のPropsを確認
   - ✅ 各コンポーネントが受け取るべきデータ構造を把握する
   - ✅ 特に配列・オブジェクト型のPropsを見落とさない
   - ⚠️ **よくある間違い**: Footerコンポーネントが `socialLinks?: SocialLink[]` を受け取るのに空配列を渡してしまう
   - ✅ **正しい実装**: 実データ（実際のソーシャルリンク情報）を渡す

5. **インタラクション要素の確認**
   - ✅ ボタン、リンクなどのhref/onClick先をユーザーに質問
   - ✅ 全てのインタラクション要素を洗い出してから質問する

### タスクリスト（必須）

以下の12ステップでタスクリストを作成：

1. **MCP情報取得**: `get_design_context` + `get_screenshot` + `get_code_connect_map` + `get_metadata` でFigma情報取得
   - ⚠️ **4つすべて実行すること**（どれか1つでも欠けるとプラン不備の原因になる）
2. **Figma Raw作成**: `app/[route]/` に page.tsx の横に `figma-raw.tsx` 作成
   - ⚠️ Code Connectで既存コンポーネントがある場合でも、**Page Rawファイルは必ず作成する**
   - ⚠️ 作成後、importパスを `@awesome/design-system` に修正
3. **画像アセットダウンロード**: Figma Raw の `localhost:3845` URL から画像を `public/images/` にダウンロード
   - ⚠️ 既存コンポーネント内に画像がない場合は**必ずダウンロード**すること
   - `curl` で一括ダウンロード推奨
4. **routes.ts作成/確認**: `features/[feature]/routes.ts` の存在確認
   - ⚠️ 存在しない場合は新規作成が必要
   - 既存の `features/auth/routes.ts` や `features/user/routes.ts` を参考にする
5. **OpenAPI定義追加**: `backend/build/openapi/openapi.json` にAPI定義追加
   - ⚠️ backend側に追加（frontend_web/openapi.jsonではない）
   - ⚠️ schema名は英語で定義（日本語はNG）
6. **Orval生成**: `pnpm generate:api` 実行
   - ⚠️ 生成後、`model/index.ts`と`functions.ts`で型・関数が生成されたか確認
7. **モックデータ追加**: `api_mock_mode/data.ts` + `api_mock_mode/fetcher.ts`
8. **Query/Action実装**: データ取得・変更ロジック作成
9. **test-ids定義**: `features/[feature]/test-ids.ts` 作成
10. **Screen実装**: RSCパターンでScreen component作成（`next/image` 使用）
11. **Screen Test作成**: vi.mock()による統合テスト作成
12. **app/[feature]/page.tsx作成**: RSCでqueryを呼び出し、Screenに渡す
13. **モック動作確認**: `pnpm dev:mock` でブラウザ確認
14. **Test実行**: `pnpm test` で全テスト成功確認
15. **Type Check**: `pnpm typecheck` で型エラー確認

### 進捗表示ルール（必須）

**作業開始時と各ステップ完了時に、以下の形式で進捗状況を表示すること：**

```
## [ページ名] ページ取り込み - 進捗状況

1. ✅ **MCP情報取得** - 完了
2. 🔄 **Figma Raw作成** - 進行中
3. ⏳ **画像アセットダウンロード**
4. ⏳ **routes.ts作成/確認**
5. ⏳ **OpenAPI定義追加**
6. ⏳ **Orval生成**
7. ⏳ **モックデータ追加**
8. ⏳ **Query/Action実装**
9. ⏳ **test-ids定義**
10. ⏳ **Screen実装**
11. ⏳ **Screen Test作成**
12. ⏳ **app/[feature]/page.tsx作成**
13. ⏳ **モック動作確認**
14. ⏳ **Test実行**
15. ⏳ **Type Check**

---
```

**ステータス記号:**
- ✅ = 完了 (completed)
- 🔄 = 進行中 (in_progress)
- ⏳ = 待機中 (pending)

**表示タイミング:**
- 作業開始時: 最初に全体の進捗を表示
- 各ステップ完了時: 更新された進捗状況を表示
- 作業完了時: 全ステップ完了を表示

### 1. ディレクトリ構成

```
app/
└── (authenticated)/
    └── [feature]/
        ├── page.tsx                      # ページエントリーポイント（RSC）
        └── figma-raw.tsx                 # Figma生データ（参考用）

features/
└── [feature]/
    ├── screens/
    │   ├── [ScreenName].tsx              # 実装版（RSC）
    │   └── [ScreenName].spec.tsx         # Screen Test
    ├── queries/
    │   └── get[Data].ts                  # データ取得（React.cache）
    └── actions/
        └── [action].ts                   # データ変更（Server Actions）
```

**例:**
```
app/
└── (authenticated)/
    └── home/
        ├── page.tsx
        └── figma-raw.tsx

features/
└── home/
    ├── screens/
    │   ├── HomeScreen.tsx
    │   └── HomeScreen.spec.tsx
    └── queries/
        └── getTestimonials.ts
```

### 2. 画像アセット管理

**重要**: Figma から画像アセットを必ずダウンロードして配置し、`next/image` で最適化すること。

#### 画像の配置場所

```
public/
└── images/
    ├── logos/          # ロゴ画像
    ├── icons/          # アイコン画像
    ├── hero/           # ヒーローイメージ
    └── testimonials/   # お客様の声など
```

#### 画像ダウンロード手順

**推奨: MCP から自動取得（Page Level）**

Page Level 取り込み時は、Figma Raw に含まれる `localhost:3845` の画像 URL から直接ダウンロード可能：

1. **Figma Raw から画像 URL を確認**
   ```typescript
   // HomePage.figma-raw.tsx
   const img = "http://localhost:3845/assets/d4c3bac78b200cfb907deaea86f331a1ec54cb0a.svg";
   const img3 = "http://localhost:3845/assets/f7670ccd9f4a0daef6ffdd182abe963966b9e064.svg";
   // ...
   ```

2. **curl でダウンロード**
   ```bash
   # ロゴ
   curl -s http://localhost:3845/assets/d4c3bac78b200cfb907deaea86f331a1ec54cb0a.svg \
     -o public/images/logos/figma-logo.svg

   # ソーシャルアイコン
   curl -s http://localhost:3845/assets/06d5686ebc43f358ce6232b368c6aaa3e6dc3c02.svg \
     -o public/images/icons/social/x-logo.svg
   ```

3. **複数画像を一括ダウンロード**
   ```bash
   curl -s URL1 -o public/images/logos/logo.svg && \
   curl -s URL2 -o public/images/icons/icon1.svg && \
   curl -s URL3 -o public/images/icons/icon2.svg
   ```

**代替: 手動エクスポート**

MCP で画像が取得できない場合：

1. Figma Desktop でコンポーネントを開く
2. 画像レイヤーを選択 → 右クリック → Export
3. フォーマット: PNG（透過）、JPG（写真）、SVG（アイコン）
4. 解像度: @2x または @3x（Retina 対応）
5. `public/images/[カテゴリ]/` に配置
6. 命名規則: `kebab-case.png` (例: `figma-logo.svg`)

#### 実装で使用

```tsx
import Image from "next/image";

// ✅ 推奨: next/image で最適化
<Image
  src="/images/logos/figma-logo.svg"
  alt="Figma Logo"
  width={40}   // Figma Raw の className="w-[40px]" から取得
  height={35}  // Figma Raw の className="h-[35px]" から取得
/>

// ❌ 非推奨: 通常の img タグ（最適化されない）
<img src="/images/logos/figma-logo.svg" alt="Figma Logo" />
```

**width/height の取得方法:**
Figma Raw の画像を含む要素の `className` から読み取る：
```tsx
// Figma Raw
<div className="h-[35px] relative shrink-0 w-[40px]">
  <img src={imgFigma} ... />
</div>

// → width={40} height={35} を使用
```

#### next/image の利点

- ✅ 自動的に WebP/AVIF に変換（対応ブラウザのみ）
- ✅ レスポンシブサイズ自動生成
- ✅ 遅延読み込み（Lazy Loading）
- ✅ `.next/cache/images/` に60日間キャッシュ
- ✅ ビルド時に最適化

#### Figma Raw との使い分け

- **Figma Raw (`.figma-raw.tsx`)**:
  - 通常の `<img>` タグで保持（参考用）
  - `http://localhost:3845/assets/...` のままでOK

- **実装 (`Screen.tsx`, `Component.tsx`)**:
  - `next/image` の `Image` コンポーネント使用
  - `/images/` からの絶対パス

### 3. API統合ワークフロー

Page Levelコンポーネントは、バックエンド実装前でもAPI連携を完成させます。

**⚠️ typecheck対策（必読）**

以下の順序を守ることで、typecheck時のエラーを最小限に抑えられます：

1. **OpenAPI定義は必ずbackend側に追加**
   - `backend/build/openapi/openapi.json` に定義
   - `frontend_web/openapi.json` には追加しない

2. **schema名は英語で定義**
   - ❌ `"ユーザーの声"` → Orvalで変換必要
   - ✅ `"UserVoice"` → そのまま型として使える

3. **Orval生成後にimport確認**
   - `features/shared/api/generated/model/index.ts` に型がexportされているか確認
   - `features/shared/api/generated/functions.ts` に関数が生成されているか確認

4. **Figma Rawのimportパス修正**
   - MCPで生成されたコンポーネントimportを `@awesome/design-system` に修正

#### Step 1: 本番openapi.jsonにAPI定義を追加

**⚠️ 重要: 定義場所**
- **backend/build/openapi/openapi.json** に追加（backend側）
- ~~frontend_web/openapi.json~~ には追加しない（Orvalはbackend側を参照）

**ファイル:** `backend/build/openapi/openapi.json`

```json
{
  "paths": {
    "/testimonials": {
      "get": {
        "tags": ["Figma取り込み (一時)"],
        "summary": "Testimonials取得",
        "description": "【注意】この定義はFigma取り込み用の一時的なものです。Springでコードファーストから生成された際に上書きされます。",
        "operationId": "getTestimonials",
        "x-figma-temporary": true,
        "responses": {
          "200": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "testimonials": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Testimonial" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Testimonial": {
        "type": "object",
        "required": ["quote", "title", "description", "avatarSrc"],
        "properties": {
          "quote": { "type": "string" },
          "title": { "type": "string" },
          "description": { "type": "string" },
          "avatarSrc": { "type": "string", "format": "uri" }
        }
      }
    }
  }
}
```

**重要:**
- バックエンド未実装でもOK（モックモードで動作確認可能）
- タグ `Figma取り込み (一時)` を付けて一時的な定義であることを明示
- カスタムフィールド `x-figma-temporary: true` を追加
- **schema名は必ず英語で定義すること**（日本語だとOrvalで型生成時にマッピングが必要になる）

#### Step 2: Orval生成

```bash
pnpm generate:api
```

**自動生成されるファイル:**
- `features/shared/api/generated/functions.ts` - API関数
- `features/shared/api/generated/model/` - 型定義

**生成される関数例:**
```typescript
// features/shared/api/generated/functions.ts
export const getTestimonials = async (options?: RequestInit): Promise<getTestimonialsResponse> => {
  return fetcher<Promise<getTestimonialsResponse>>(getGetTestimonialsUrl(), {
    ...options,
    method: 'GET'
  });
}
```

#### Step 3: モックデータ追加

**ファイル:** `api_mock_mode/data.ts`

```typescript
import type { Testimonial } from "@/features/shared/api/generated/model";

export const mockTestimonials: Testimonial[] = [
  {
    quote: "This product has completely transformed how we work.",
    title: "Sarah Johnson",
    description: "CEO, TechCorp",
    avatarSrc: "https://i.pravatar.cc/150?img=1",
  },
  // ... more items
];
```

**ファイル:** `api_mock_mode/fetcher.ts`

```typescript
import { mockTestimonials } from "./data";

function getMockResponse(path: string, method: string): unknown {
  // GET /testimonials
  if (path === "/testimonials" && method === "GET") {
    return {
      data: { testimonials: mockTestimonials },
      status: 200,
    };
  }

  // ... other endpoints
}

export async function mockFetcher<TData, TVariables = unknown>(
  path: string,
  options: RequestInit & { data?: TVariables } = {},
): Promise<TData> {
  const method = options.method || "GET";
  await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate network delay
  return getMockResponse(path, method) as TData;
}
```

**重要:**
- `api_mock_mode/`は**永続的に保持**（API実装後も使用）
- 開発時に`NEXT_PUBLIC_API_MOCK_MODE=enabled`で全APIをモック化可能
- バックエンドサーバー起動不要で高速開発が可能

#### Step 4: Query/Action実装

**必ず本番関数をimportすること** - 環境変数による自動切り替えを利用。

```typescript
// features/home/queries/getTestimonials.ts
import { getTestimonials as getTestimonialsAPI } from "@/features/shared/api/generated/functions";
import type { Testimonial } from "@/features/shared/api/generated/model";
import { cache } from "react";

export type { Testimonial };

/**
 * Get testimonials data
 * Server-side query function using Orval-generated API client
 * Wrapped with React.cache for request deduplication
 *
 * Note: バックエンド未実装。NEXT_PUBLIC_API_MOCK_MODE=enabled でモックデータを使用
 */
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const response = await getTestimonialsAPI();
  return response.data.testimonials;
});
```

**重要:**
- `cache()`でラップしてReact Server Componentsでのリクエスト重複排除
- 必ず本番関数（`@/features/shared/api/generated/functions`）をimport
- 環境変数で自動的にモック/実APIが切り替わる

#### Step 5: Screen Test作成

**必ず本番関数をモックすること** - Screen Testは本実装に対してテスト。

```typescript
// features/home/screens/HomeScreen.spec.tsx
import { getTestimonials } from "@/features/home/queries/getTestimonials";
import { HomeScreen } from "@/features/home/screens/HomeScreen";
import { HomeTestIds } from "@/features/home/test-ids";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// 本番API関数をモック（Screen Testは本実装に対してテスト）
vi.mock("@/features/shared/api/generated/functions", () => ({
  getTestimonials: vi.fn(),
}));

const { getTestimonials: getTestimonialsAPI } = await import(
  "@/features/shared/api/generated/functions"
);

describe("HomeScreen - TestC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("正常系", () => {
    it("APIから取得したtestimonialsが表示される", async () => {
      // Given: API レスポンスモック
      const mockResponse = {
        data: {
          testimonials: [
            {
              quote: "Test quote",
              title: "Test User",
              description: "Test Role",
              avatarSrc: "https://example.com/avatar.jpg",
            },
          ],
        },
        status: 200,
      };
      vi.mocked(getTestimonialsAPI).mockResolvedValue(mockResponse);

      // When: データ取得 → 画面レンダリング
      const testimonials = await getTestimonials();
      render(<HomeScreen testimonials={testimonials} />);

      // Then: モックデータが表示される
      expect(screen.getByText("Test quote")).toBeInTheDocument();
      expect(screen.getByTestId(HomeTestIds.testimonialCard)).toBeInTheDocument();
    });
  });
});
```

**重要:**
- 必ず本番関数をモック（`@/features/shared/api/generated/functions`）
- Screen Testは本実装に対してテスト（モックモード関数ではない）
- `vi.mock()`を使用（MSWは使わない）

#### Step 6: ブラウザで確認

```bash
pnpm dev:mock
```

**動作:**
- `fetcher.ts`が環境変数を検出
- 動的に`api_mock_mode/fetcher.ts`をimport
- `api_mock_mode/data.ts`のモックデータを返す
- importの切り替え不要（全てのAPIが自動的にモック化）

### 3. バックエンド実装後の対応

1. **バックエンドがAPIを実装** - すでにopenapi.jsonに定義済みなので実装するだけ
2. **`pnpm generate:api`を実行** - 本番functions.tsが更新される
3. **Query/Action/Test のコード変更不要** - すでに本番関数をimportしているため
4. **`api_mock_mode/`は永続的に保持** - API実装後も開発環境で使用可能

### 4. モックシステムの仕組み

```
┌─────────────────────────────────────────────────────┐
│ Query/Action                                        │
│   import { getTestimonials } from                   │
│     "@/features/shared/api/generated/functions"     │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ features/shared/api/generated/functions.ts          │
│   export const getTestimonials = async () => {      │
│     return fetcher(...)  // ← ここで環境変数チェック │
│   }                                                  │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ features/shared/api/fetcher.ts                      │
│   if (process.env.NEXT_PUBLIC_API_MOCK_MODE === ... │
│     const { mockFetcher } =                         │
│       await import("@/api_mock_mode/fetcher");      │
│     return mockFetcher(...) // ← モック！            │
│   }                                                  │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ api_mock_mode/fetcher.ts                            │
│   function getMockResponse(path, method) {          │
│     if (path === "/testimonials" ...)               │
│       return { data: { testimonials: mock... } }    │
│   }                                                  │
└─────────────────────────────────────────────────────┘
```

**メリット:**
- Query/Actionのコード変更不要（環境変数だけで切り替え）
- RSC（React Server Components）とClient Componentsの両方で動作
- テストも本番関数をモックするだけ（一貫性）

## ワークフロー図

```
┌─────────────────────────────────────────────────────────┐
│ 1. Figmaから取り込み                                       │
│    get_design_context + get_screenshot                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 2. 本番openapi.jsonにAPI定義を追加                         │
│    backend/build/openapi/openapi.json                    │
│    （バックエンド未実装でもOK）                             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Orval生成                                              │
│    pnpm generate:api                                     │
│    → functions.ts, model/ 自動生成                        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 4. モックデータ追加                                        │
│    api_mock_mode/data.ts                                 │
│    api_mock_mode/fetcher.ts                              │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Query/Action実装                                       │
│    features/[feature]/queries/xxx.ts                    │
│    → 本番functions.tsをimport + cache()                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Screen Test作成                                        │
│    vi.mock()で本番functions.tsをモック                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 7. ブラウザで確認                                          │
│    pnpm dev:mock                                         │
│    → fetcher → mockFetcher（環境変数で自動切り替え）        │
└─────────────────────────────────────────────────────────┘
```

## よくあるエラーとトラブルシューティング

### エラー1: typecheck時に型が見つからない

```
error TS2305: Module '"@/features/shared/api/generated/model"' has no exported member 'UserVoice'.
```

**原因:**
- OpenAPI定義が間違った場所にある（frontend_web/openapi.jsonに追加している）
- schema名が日本語で定義されている

**解決策:**
1. `backend/build/openapi/openapi.json` に定義を追加
2. schema名を英語で定義（例: `"UserVoice"`）
3. `pnpm generate:api` 再実行
4. `features/shared/api/generated/model/index.ts` でexportされているか確認

### エラー2: Figma Rawファイルのimportエラー

```
error TS2307: Cannot find module './Header' or its corresponding type declarations.
```

**原因:**
- MCPで生成されたimportパスが相対パスやFigma MCPのパスになっている

**解決策:**
- コンポーネントimportを `@awesome/design-system` に変更
- 例: `import { Header } from "@awesome/design-system";`

### エラー3: fetch failed（実行時エラー）

```
Error: fetch failed
```

**原因:**
- モックモードではなく通常モードで起動しているため、実際のバックエンドAPIにアクセスしようとして失敗

**解決策:**
- モックモードで再起動: `NEXT_PUBLIC_API_MOCK_MODE=enabled pnpm dev`
- または: `pnpm dev:mock`

## チェックリスト

**進捗管理（必須）:**
- [ ] **TodoWriteツールでタスクリスト作成**（15ステップ）

**基本:**
- [ ] `get_design_context` + `get_screenshot` + `get_code_connect_map` + `get_metadata` で仕様確認
- [ ] Figma Rawファイル作成（`app/[route]/` に page.tsx の横）
- [ ] **Figma Rawのコンポーネントimportを `@awesome/design-system` に修正**
- [ ] Figmaデザイントークン（`--sds-*`）使用
- [ ] `pnpm typecheck`成功
- [ ] 見た目がFigmaスクリーンショットと一致

**API連携（Page Level固有）:**
- [ ] **backend側の**本番openapi.jsonにAPI定義を追加（`x-figma-temporary: true`）
- [ ] **schema名は英語で定義**
- [ ] `pnpm generate:api`でOrval生成を実行
- [ ] **生成された型・関数が`model/index.ts`と`functions.ts`に存在するか確認**
- [ ] `api_mock_mode/data.ts`にモックデータを追加
- [ ] `api_mock_mode/fetcher.ts`にモックレスポンスを追加
- [ ] `queries/`または`actions/`にラッパー関数を作成（本番functions.tsをimport）
- [ ] Screen component実装（RSCパターン）
- [ ] vi.mock()で本番functions.tsをモックしたScreen Testを作成
- [ ] `pnpm test`でテストが成功
- [ ] `pnpm dev:mock`でブラウザ動作確認（環境変数でモック自動切り替え）
