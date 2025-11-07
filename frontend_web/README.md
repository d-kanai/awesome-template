# Frontend Web

Web版フロントエンドアプリケーション（Next.js + React + TypeScript）

## 技術スタック

### コア
- **Next.js**: 15.1.4（App Router）
- **React**: 19.1.0
- **TypeScript**: 5.9.2
- **Node.js**: 22.12.0（LTS）
- **pnpm**: 10.10.0

### 状態管理・データフェッチング
- **TanStack Query**: 5.90.5（データフェッチング、キャッシング）
- **TanStack Form**: 1.23.8（フォーム状態管理）
- **Zod**: 3.25.76（バリデーション）

### スタイリング
- **Tailwind CSS**: 3.4.17
- **class-variance-authority**: 0.7.1（バリアント管理）
- **clsx** + **tailwind-merge**（クラス名結合）

### API連携
- **Orval**: 7.1.1（OpenAPI → APIクライアント生成）
- **Custom Fetcher**: httpOnly Cookie認証対応

### 機能フラグ
- **Unleash Proxy Client**: 5.0.1

### テスト
- **Vitest**: 2.1.8（ユニットテスト）
- **@testing-library/react**: 16.1.0
- **Playwright**: 1.49.1（E2Eテスト、Chromeのみ）
- **@cucumber/cucumber**: 11.1.0（Gherkin）

### コード品質
- **Biome**: 1.9.4（リント・フォーマット）
- **Knip**: 5.66.4（デッドコード検出）

## ディレクトリ構造

```
frontend_web/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト（プロバイダー設定）
│   ├── page.tsx           # ホームページ
│   ├── auth/              # 認証ルート
│   └── user/              # ユーザールート
│
├── features/              # 機能ベースの構成
│   ├── auth/              # 認証機能
│   │   ├── components/    # SigninForm, SignupForm
│   │   ├── hooks/         # useSigninForm, useSignupForm
│   │   └── screens/       # SigninScreen, SignupScreen
│   ├── user/              # ユーザー機能
│   │   ├── components/    # UserListItem
│   │   ├── hooks/         # useUserList
│   │   └── screens/       # UserListScreen
│   └── shared/            # 共通機能
│       ├── api/
│       │   ├── generated/ # Orvalで生成されたAPIクライアント
│       │   └── fetcher.ts # カスタムfetch（Cookie認証）
│       ├── figma_generated/  # Figmaから自動生成（予定）
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   ├── Label.tsx
│       │   └── Card.tsx
│       ├── components/    # 自作コンポーネント
│       │   └── FormInput.tsx
│       ├── hooks/         # useFeatureFlag
│       ├── providers/     # QueryProvider, AuthProvider, FeatureFlagProvider
│       └── lib/           # utils, constants, testsupport
│
├── e2e/                   # E2Eテスト
│   ├── features/          # Gherkin feature files
│   └── steps/             # Step definitions
│
├── public/                # 静的アセット
└── ...                    # 設定ファイル
```

## セットアップ

### 前提条件
- Node.js 22.12.0
- pnpm 10.10.0

### インストール

```bash
# ルートディレクトリから
make web-install
```

## 開発コマンド

### 開発サーバー起動
```bash
# ルートから
make web-dev

# またはfrontend_webディレクトリで
pnpm dev
```
http://localhost:3000 でアクセス

### ビルド
```bash
make web-build
# または
pnpm build
```

### リント・フォーマット
```bash
make web-lint
# または
pnpm lint        # チェックのみ
pnpm lint:fix    # 自動修正
```

### 型チェック
```bash
make web-typecheck
# または
pnpm typecheck
```

### APIクライアント生成
```bash
# バックエンドのOpenAPI仕様からクライアント生成
make web-generate-api
# または
pnpm generate:api
```

### テスト

#### ユニットテスト
```bash
make web-ut
# または
pnpm test              # 実行
pnpm test:watch        # ウォッチモード
pnpm test:coverage     # カバレッジ付き
```

テストファイル: 実コードの横に `.spec.tsx` を配置
```
Component.tsx
Component.spec.tsx
```

#### E2Eテスト
```bash
make web-e2e
# または
pnpm test:e2e
```

E2Eテスト: Playwright + Gherkin（Chromeのみ）
- Feature files: `e2e/features/*.feature`
- Step definitions: `e2e/steps/*.steps.ts`

### Docker

#### ビルド
```bash
make web-docker-build
# または
docker build -t frontend_web:latest .
```

#### 実行
```bash
make web-docker-run
# または
docker run -p 3000:3000 frontend_web:latest
```

docker-composeで起動:
```bash
cd frontend_web
docker-compose up
```

## 主要な設定ファイル

- `next.config.ts`: Next.js設定（standalone出力）
- `tailwind.config.ts`: Tailwind CSS設定
- `orval.config.ts`: API生成設定
- `vitest.config.ts`: ユニットテスト設定
- `playwright.config.ts`: E2Eテスト設定（Chromeのみ）
- `biome.json`: リント・フォーマット設定
- `knip.json`: デッドコード検出設定

## アーキテクチャ

### 認証
- **httpOnly Cookie認証**
- フロントエンドでトークンを保持しない
- `credentials: 'include'` でCookieを送信
- バックエンドで認証状態を管理

### プロバイダー階層
```
QueryClientProvider
  └── AuthProvider
      └── FeatureFlagProvider
          └── アプリケーション
```

### データフェッチング
- TanStack Query（React Query v5）
- OrvalでOpenAPIから自動生成
- カスタムfetcherでCookie認証

### フォーム管理
- TanStack Form
- Zod統合バリデーション
- フィールドレベルバリデーション

### デザインシステム
- **features/shared/figma_generated/**: Figmaから自動生成（予定）
- **features/shared/components/**: 自作コンポーネント
- Figma Code Connectで連携予定

## 環境変数

`.env.local` を作成:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## テストパターン

### ユニットテスト
```typescript
it("フォーム送信時、正しいパラメータでサインアップAPIを呼び出し、成功後にサインイン画面に遷移する", async () => {
  // given: モックAPIセットアップ
  // when: フォーム入力・送信
  // then: API呼び出し確認、画面遷移確認
});
```

### E2Eテスト（Gherkin）
```gherkin
Feature: 認証機能
  Scenario: 新規ユーザーのサインアップとサインイン
    Given アプリを起動してサインイン画面を表示
    When サインアップ画面に遷移
    Then サインイン画面に遷移
```

## Figma Code Connect統合（準備中）

現在、`features/shared/figma_generated/` にはプレースホルダーコンポーネントが配置されています。

Figma Code Connect設定後:
1. Figmaでコンポーネントを設計
2. Figma Code Connectで自動生成
3. `figma_generated/` に配置
4. `.gitignore` で除外（自動生成のため）

## トラブルシューティング

### 開発サーバーが起動しない
- Node.jsバージョンを確認: `node -v` → 22.12.0
- pnpmバージョンを確認: `pnpm -v` → 10.10.0
- 依存関係を再インストール: `pnpm install --force`

### APIが呼べない
- バックエンドが起動しているか確認
- CORS設定を確認（credentials: trueが必要）
- Cookie設定を確認（httpOnly, sameSite）

### テストが失敗する
- モックが正しく設定されているか確認
- `cleanupMocks()` でモックをクリアしているか確認

## 参考リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Form](https://tanstack.com/form/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Playwright](https://playwright.dev/)
- [Unleash](https://docs.getunleash.io/)
