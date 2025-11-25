# 🚀 Awesome Template

フロントエンドWeb開発のためのテンプレートプロジェクト

## 📖 ドキュメント

- [コーディング規約](./frontend_web/doc/code_rule.md)

## 🛠️ 技術スタック

### 💻 言語・ランタイム
| 技術 | バージョン |
|------|-----------|
| TypeScript | 5.x |
| React | 19 |
| Next.js | 16 |
| Node.js | 22 |

### 📦 パッケージマネージャー
- pnpm

### 🔄 状態管理・データフェッチ
- TanStack Query
- TanStack Form
- Zustand

### ✅ バリデーション
- Zod

### 🎨 スタイリング
- Tailwind CSS

### 🧪 テスト
| ツール | 用途 |
|--------|------|
| Vitest | ユニットテスト |
| React Testing Library | コンポーネントテスト |
| Playwright | E2Eテスト |
| Cucumber | BDDシナリオ |

### 🔧 コード品質
- Biome (リント・フォーマット)
- Lefthook (Git hooks)

### 🐳 コンテナ
- Podman

## 🚀 クイックスタート

```bash
# 1. セットアップ
make install

# 2. 開発サーバー起動
make web-dev

# 3. ブラウザで http://localhost:3000 を開く
```

## 📋 利用可能なコマンド

`make help` で全コマンドを確認できます。

### セットアップ
```bash
make install              # 全体セットアップ
make lefthook-install     # Git hooksインストール
```

### 開発
```bash
make web-install          # 依存関係インストール
make web-dev              # 開発サーバー起動
make web-dev-mock         # モックAPIで開発サーバー起動
```

### ビルド
```bash
make web-build            # 本番用ビルド
make web-generate-api     # APIクライアント生成
```

### コード品質
```bash
make web-lint             # リント・フォーマットチェック
make web-typecheck        # 型チェック
```

### テスト
```bash
make web-ut               # ユニットテスト
make web-ut-coverage      # ユニットテスト + カバレッジ
make web-e2e              # E2Eテスト
make web-e2e-mock         # モックAPIでE2Eテスト
```

### コンテナ
```bash
make web-podman-build     # コンテナイメージビルド
make web-podman-run       # コンテナ起動
```
