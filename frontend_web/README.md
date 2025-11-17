# Frontend Web

Web版フロントエンドアプリケーション（Next.js + React + TypeScript）

## Documentation

- [コーディング規約](./doc/code_rule.md) - AIが順守すべきルール
- [Figmaコンポーネント取り込み（Component Level）](./doc/figma_import_component.md)
- [Figmaページ取り込み（Page Level）](./doc/figma_import_page.md)
- [マルチステップフロー制御](./doc/flow_control.md)

## 技術スタック

### コア
- **Next.js**: 16.0.3（App Router with Turbopack）
- **React**: 19.1.1
- **TypeScript**: 5.9.2
- **Node.js**: 22.21.1
- **pnpm**: 10.10.0

### 状態管理・データフェッチング
- **Server Components (RSC)**: デフォルトのデータ取得
- **Server Actions**: データ変更処理
- **react-hook-form**: クライアントサイドフォーム状態管理
- **Zod**: バリデーション、フォームスキーマ（client/server共通）

### スタイリング
- **Tailwind CSS**: ユーティリティファースト
- **shadcn/ui**: CSS変数ベーステーマ管理
- **next-themes**: ダークモード対応

### API連携・ロギング
- **Orval**: OpenAPI → TypeScript型安全APIクライアント生成
- **Pino**: 高性能構造化JSONロガー（requestId、userId、sessionId自動付与）

### 機能フラグ
- **Unleash Proxy Client**: A/Bテスト・段階的ロールアウト

### テスト
- **Vitest**: ユニットテスト（Screen Level統合テスト含む）
- **@testing-library/react**: React Testing Library
- **Playwright**: E2Eテスト
- **@cucumber/cucumber**: Gherkin BDD

### コード品質
- **Biome**: リント・フォーマット（ESLint/Prettier代替）
- **Knip**: デッドコード検出

### デザイン連携
- **Figma Desktop MCP**: Figmaデザインからコード生成
- **figma-code-connect**: Figmaコンポーネント↔コンポーネント紐付け

## ディレクトリ構造

```
frontend_web/
├── app/                      # Next.js App Router（ルーティングのみ）
│   ├── layout.tsx            # ルートレイアウト（プロバイダー設定）
│   ├── page.tsx              # ホームページ（RSC + Screen呼び出し）
│   ├── auth/                 # 機能ごとのルーティング
│
├── features/                 # 機能ベースの構成（Feature-Sliced Design）
│   ├── auth/                 # 機能モジュール
│   │   ├── queries/          # データ取得
│   │   ├── actions/          # データ変更
│   │   ├── components/       # 内部コンポーネント
│   │   ├── hooks/            # カスタムフック
│   │   ├── screens/          # Screen Component
│   │   ├── routes.ts         # ルーティング定数
│   │   ├── schemas.ts        # Zodスキーマ（client/server共通）
│   │   └── test-ids.ts       # data-testid定数
│   └── shared/               # 共通機能
│       ├── api/
│       │   ├── generated/    # Orvalで生成（hooks.ts, functions.ts, model/）
│       ├── ui/
│       │   ├── atoms/        # Atoms（Button, Input, Label）
│       │   ├── components/   # 汎用コンポーネント
│       │   └── figma_generated/  # Figma自動生成コンポーネント
│       ├── providers/        
│       ├── hooks/            
│       └── lib/
├── api_mock_mode/            # モックモード（NEXT_PUBLIC_API_MOCK_MODE=true時）
├── e2e/                      # E2Eテスト（Playwright + Cucumber）
├── config/                   # 設定ファイル
├── doc/                      # ドキュメント
│   ├── code_rule.md          # コーディング規約
│   ├── figma_import_component.md
│   ├── figma_import_page.md
│   └── flow_control.md
│
└── public/                   # 静的アセット
```

## セットアップ

### 前提条件
- Node.js 22.21.1
- pnpm 10.10.0
- Docker Desktop（バックエンドAPI用）

### インストール

```bash
pnpm install
```

### 開発サーバー起動

```bash
# 通常モード（バックエンドAPIに接続）
pnpm dev

# モックモード（バックエンド不要）
pnpm dev:mock

# Webpack使用モード
pnpm dev:webpack
pnpm dev:mock:webpack
```

### テスト

```bash
# ユニットテスト
pnpm test
pnpm test:watch
pnpm test:coverage

# E2Eテスト
pnpm test:e2e
```

### ビルド

```bash
pnpm build
pnpm build:analyze  # バンドルサイズ分析
```

### コード品質

```bash
pnpm lint           # Biomeチェック
pnpm lint:fix       # Biome自動修正
pnpm typecheck      # TypeScriptチェック
```

### API型生成

```bash
# バックエンドのOpenAPI定義から型を生成
pnpm generate:api
```
