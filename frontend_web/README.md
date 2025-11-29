# Frontend Web

Web版フロントエンドアプリケーション（Next.js + React + TypeScript）

## アーキテクチャ概要

![Next.js Architecture Overview](./doc/nextjs_overview.png)

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
- **Zustand**: グローバル状態管理（ページ跨ぎ、コンポーネント跨ぎの状態）
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

### UI開発
- **Storybook**: コンポーネントカタログ・ビジュアルテスト

### コード品質
- **Biome**: リント・フォーマット（ESLint/Prettier代替）
- **dependency-cruiser**: 依存方向チェック（shared → features 禁止）
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
│   └── auth/                 # 機能ごとのルーティング
│
├── features/                 # 機能ベースの構成（Feature-Sliced Design）
│   ├── auth/                 # 機能モジュール
│   │   ├── queries/          # データ取得
│   │   ├── actions/          # データ変更
│   │   ├── stores/           # Zustandストア（グローバル状態）
│   │   ├── components/       # 内部コンポーネント
│   │   ├── hooks/            # カスタムフック
│   │   ├── screens/          # Screen Component
│   │   ├── routes.ts         # ルーティング定数
│   │   ├── schemas.ts        # Zodスキーマ（client/server共通）
│   │   └── test-ids.ts       # data-testid定数
│   ├── home/
│   ├── user/
│   └── multi_flow/
│
├── shared/                   # 共通機能（⚠️ features に依存してはいけない）
│   ├── api/
│   │   └── generated/        # Orvalで生成（hooks.ts, functions.ts, model/）
│   ├── ui/
│   │   ├── atoms/            # Atoms（Button, Input, Label）
│   │   ├── components/       # 汎用コンポーネント
│   │   └── figma_generated/  # Figma自動生成コンポーネント
│   ├── providers/
│   ├── hooks/
│   └── lib/
│
├── scripts/                  # 開発ツール
│   └── show-route/           # 画面遷移可視化ツール
│
├── api_mock_mode/            # モックモード（NEXT_PUBLIC_API_MOCK_MODE=true時）
├── e2e/                      # E2Eテスト（Playwright + Cucumber）
├── config/                   # 設定ファイル
├── doc/                      # ドキュメント
└── public/                   # 静的アセット
```

### 依存方向ルール

```
features/ ──→ shared/    ✅ OK
shared/   ──→ features/  ❌ NG（shared は features に依存してはいけない）
feature A ──→ feature B  ❌ NG（routes.ts のみ許可）
```

`pnpm lint:deps` で依存方向をチェックできます。

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

### Storybook

```bash
# Storybook起動（開発モード）
pnpm storybook

# Storybookビルド（静的サイト生成）
pnpm build-storybook
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
pnpm lint:deps      # 依存方向チェック（shared → features 禁止）
pnpm typecheck      # TypeScriptチェック
```

### 開発ツール

```bash
pnpm show:routes    # 画面遷移ツリーを可視化
```

出力例:
```
🗺️  画面遷移ツリー
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏠 /
├── 🔐 /auth/signin
│   └── 📝 /auth/signup
├── 📄 /contact
└── 👤 /user

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 総ページ数: 6
```

### API型生成

```bash
# バックエンドのOpenAPI定義から型を生成
pnpm generate:api
```
