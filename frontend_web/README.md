# Frontend Web

Web版フロントエンドアプリケーション（Next.js + React + TypeScript）

## Documentation

- [コーディング規約](./doc/code_rule.md)
  - AIが順守する。

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

### Figmaデザイントークン同期

#### 現在（Professional Plan）: Plugin方式
```bash
# Figma PluginでエクスポートしたJSONを読み込み、Tailwind形式に変換
pnpm figma:sync:plugin

# または個別実行
pnpm figma:import:plugin  # PluginエクスポートJSONを読み込み
pnpm figma:generate       # Tailwind形式に変換
```

**手順:**
1. Figmaで対象ファイルを開く
2. プラグイン → "Design Tokens (W3C) Export" を実行
3. エクスポートされたJSONファイルをダウンロード
4. `design-tokens/figma-plugin-export.json` として保存
5. `pnpm figma:sync:plugin` を実行

#### 将来（Enterprise Plan）: API方式
```bash
# Figma REST APIからデザイントークンを自動取得
pnpm figma:sync

# または個別実行
pnpm figma:fetch      # Figma APIからトークン取得
pnpm figma:generate   # Tailwind形式に変換
```

**セットアップ（Enterprise移行後）:**
1. `.env.local.example` を `.env.local` にコピー
2. Figma Personal Access Token を取得して設定
3. Figma File Key を設定
4. `pnpm figma:sync` を実行

> **注意**: Variables REST APIはEnterprise Planでのみ利用可能です。Professional Planでは上記のPlugin方式を使用してください。

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

`.env.local` を作成（`.env.local.example`を参考に）:

```bash
# Figma API設定
FIGMA_ACCESS_TOKEN=figd_xxxxx...
FIGMA_FILE_KEY=1323286958747522747
```

**Figma Personal Access Tokenの取得方法:**
1. Figma → Settings → Personal access tokens
2. "Generate new token" をクリック
3. 必要なスコープ: `File content (read-only)`
4. トークンをコピーして `.env.local` に設定

**Figma File Keyの取得方法:**
- FigmaファイルのURL: `https://www.figma.com/file/FILE_KEY/...`
- `FILE_KEY` の部分を `.env.local` に設定

## テストパターン

### Unit Test (vitest)

- TBD

### E2Eテスト（Playwright xGherkin ）

- TBD

## Figma連携

### デザイントークン自動同期

FigmaのVariablesからデザイントークンをTailwind CSS形式で自動生成できます。

#### 現在のワークフロー（Professional Plan - Plugin方式）
```
Figma Variables
  ↓ (Plugin Export)
design-tokens/figma-plugin-export.json
  ↓
scripts/figma/import-tokens-plugin.ts
  ↓
design-tokens/figma-raw.json
  ↓
scripts/figma/generate-tokens.ts
  ↓
design-tokens/tailwind-tokens.ts
  ↓
tailwind.config.ts で import
```

**使用方法:**

1. Figmaで対象ファイルを開く
2. プラグイン → "Design Tokens (W3C) Export" を実行
3. エクスポートしたJSONを `design-tokens/figma-plugin-export.json` に保存
4. `pnpm figma:sync:plugin` を実行
5. `design-tokens/tailwind-tokens.ts` が生成される
6. `tailwind.config.ts` でインポートして使用:

```typescript
import { figmaTokens } from './design-tokens/tailwind-tokens';

export default {
  theme: {
    extend: {
      colors: figmaTokens.colors,
      spacing: figmaTokens.spacing,
      fontSize: figmaTokens.fontSize,
      fontWeight: figmaTokens.fontWeight,
      lineHeight: figmaTokens.lineHeight,
    },
  },
};
```

#### 将来のワークフロー（Enterprise Plan - API方式）

Enterprise移行後は、REST APIで完全自動化可能：

```
Figma Variables
  ↓ (REST API - 自動)
scripts/figma/fetch-tokens.ts
  ↓
design-tokens/figma-raw.json
  ↓
scripts/figma/generate-tokens.ts
  ↓
design-tokens/tailwind-tokens.ts
```

1. `.env.local` に `FIGMA_ACCESS_TOKEN` と `FIGMA_FILE_KEY` を設定
2. `pnpm figma:sync` を実行（完全自動）

**推奨Figma Plugin:**
- [Design Tokens (W3C) Export](https://www.figma.com/community/plugin/1377982390646186215)
- W3C Design Tokens Format仕様準拠

### Figma Code Connect（予定）

将来的にFigma Code Connectを導入し、デザイナーがFigma上でReactコンポーネントのコードを参照できるようにする予定です。
