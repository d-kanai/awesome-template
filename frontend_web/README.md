# Frontend Web

Web版フロントエンドアプリケーション（Next.js + React + TypeScript）

## Documentation

- [コーディング規約](./doc/code_rule.md)

## 技術スタック

### コア
- **Next.js**: 15.1.4（App Router）
- **React**: 19.1.0
- **TypeScript**: 5.9.2
- **Node.js**: 22.12.0（LTS）
- **pnpm**: 10.10.0

### 状態管理・データフェッチング
- **react-hook-form**: フォーム状態管理
- **Zod**: validation, formスキーマ

### スタイリング
- **Tailwind CSS**: 3.4.17

### API連携
- **Orval**: OpenAPI → APIクライアント生成

### 機能フラグ
- **Unleash Proxy Client**

### テスト
- **Vitest**: ユニットテスト
- **@testing-library/react**: UT支援
- **Playwright**: E2Eテスト
- **@cucumber/cucumber**: Gherkin

### コード品質
- **Biome**: リント・フォーマット
- **Knip**: デッドコード検出

## ディレクトリ構造例

```
frontend_web/
├── app/                   # Next.js App Router
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
│       ├── providers/     # QueryProvider, FeatureFlagProvider
│       └── lib/           
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

# または、frontend_webディレクトリで
pnpm install
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

## アーキテクチャ

### 認証
- **httpOnly Cookie認証**

### データフェッチング
- OrvalでOpenAPIから自動生成
- カスタムfetcherでCookie認証

### フォーム管理
- react-hook-form
- Zod統合バリデーション

### デザインシステム
- **features/shared/figma_generated/**: Figmaから自動生成（予定）
- **features/shared/components/**: 自作コンポーネント
- Figma Code Connectで連携予定

## 環境変数

`.env.local` を作成:

## テストパターン

### Unit Test (vitest)

- TBD

### E2Eテスト（Playwright xGherkin ）

- TBD

## Figma Code Connect統合

- TBD
