# Figma Page Import Guide (Page Level)

このドキュメントは、Figma Desktop MCPを使用してFigmaデザインから**ページレベル**（Pages / Templates）を実装するための具体的なプロセスとガイドラインを記載しています。

**Component Level（Atoms / Molecules / Organisms）の取り込みについては [`figma_import_component.md`](./figma_import_component.md) を参照してください。**

**コーディング規約（一般的なルールやベストプラクティス）については [`code_rule.md`](./code_rule.md) を参照してください。**

## 対象コンポーネント

- **Pages**: 最上位のページコンポーネント（HomeScreen, UserListScreenなど）
- **Templates**: ページのテンプレートコンポーネント

## Page Levelの特徴

| 特徴 | Component Level | Page Level |
|-----|-----------------|------------|
| 配置場所 | `ui/atoms/`, `ui/components/` | `features/[feature]/screens/` |
| Figma Raw配置 | `figma_generated/atoms/`, `figma_generated/components/` | `figma_generated/pages/` |
| API呼び出し | ❌ なし | ✅ あり（queries/actions） |
| テスト | Storybookのみ | Screen Tests (`.spec.tsx`) |
| forwardRef | ✅ 必須 | ⚠️ オプション |
| モックワークフロー | N/A | ✅ `api_mock_mode/` |

## 基本方針

1. **コンポーネントレベルの基本ルールを踏襲** - `figma_import_component.md`の基本方針を参照
2. **API統合**: バックエンド未実装でもAPI連携とテストを完成させる
3. **Server Components**: RSC（React Server Components）パターンを使用
4. **Screen Tests**: vi.mock()による統合テスト

## 実装手順

**重要**: ページ取り込み時は、必ずTodoWriteツールでタスクリストを作成し、進捗を可視化すること。

### タスクリスト（必須）

以下の11ステップでタスクリストを作成：

1. **MCP情報取得**: `get_design_context` + `get_screenshot` でFigma情報取得
2. **Figma Raw作成**: `figma_generated/pages/` にRawファイル作成
3. **OpenAPI定義追加**: `backend/build/openapi/openapi.json` にAPI定義追加
4. **Orval生成**: `pnpm generate:api` 実行
5. **モックデータ追加**: `api_mock_mode/data.ts` + `api_mock_mode/fetcher.ts`
6. **Query/Action実装**: データ取得・変更ロジック作成
7. **Screen実装**: RSCパターンでScreen component作成
8. **Screen Test作成**: vi.mock()による統合テスト作成
9. **モック動作確認**: `make dev-mock` でブラウザ確認
10. **Test実行**: `pnpm test` で全テスト成功確認
11. **Type Check**: `pnpm typecheck` で型エラー確認

### 1. ディレクトリ構成

```
features/
├── shared/ui/figma_generated/pages/HomePage/
│   └── HomePage.figma-raw.tsx          # Figma生データ（参考用）
└── [feature]/
    ├── screens/
    │   ├── [ScreenName].tsx            # 実装版（RSC）
    │   └── [ScreenName].spec.tsx       # Screen Test
    ├── queries/
    │   └── get[Data].ts                # データ取得（React.cache）
    └── actions/
        └── [action].ts                 # データ変更（Server Actions）
```

**例:**
```
features/
├── shared/ui/figma_generated/pages/HomePage/
│   └── HomePage.figma-raw.tsx
└── home/
    ├── screens/
    │   ├── HomeScreen.tsx
    │   └── HomeScreen.spec.tsx
    └── queries/
        └── getTestimonials.ts
```

### 2. API統合ワークフロー

Page Levelコンポーネントは、バックエンド実装前でもAPI連携を完成させます。

#### Step 1: 本番openapi.jsonにAPI定義を追加

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
# Makefile経由（推奨）
make dev-mock

# または直接
NEXT_PUBLIC_API_MOCK_MODE=enabled pnpm dev
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
│    make dev-mock                                         │
│    → fetcher → mockFetcher（環境変数で自動切り替え）        │
└─────────────────────────────────────────────────────────┘
```

## チェックリスト

**進捗管理（必須）:**
- [ ] **TodoWriteツールでタスクリスト作成**（11ステップ）

**基本（Component Level参照）:**
- [ ] `get_design_context`と`get_screenshot`で仕様確認
- [ ] 依存する子コンポーネントを先に実装（Atomic Design順序）
- [ ] Figma Rawファイル作成（`figma_generated/pages/`）
- [ ] Figmaデザイントークン（`--sds-*`）使用
- [ ] `pnpm typecheck`成功
- [ ] 見た目がFigmaスクリーンショットと一致

**API連携（Page Level固有）:**
- [ ] 本番openapi.jsonにAPI定義を追加（`x-figma-temporary: true`）
- [ ] `pnpm generate:api`でOrval生成を実行
- [ ] `api_mock_mode/data.ts`にモックデータを追加
- [ ] `api_mock_mode/fetcher.ts`にモックレスポンスを追加
- [ ] `queries/`または`actions/`にラッパー関数を作成（本番functions.tsをimport）
- [ ] Screen component実装（RSCパターン）
- [ ] vi.mock()で本番functions.tsをモックしたScreen Testを作成
- [ ] `pnpm test`でテストが成功
- [ ] `make dev-mock`でブラウザ動作確認（環境変数でモック自動切り替え）
