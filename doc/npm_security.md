# npm/pnpm サプライチェーンセキュリティ対策

## 概要

npmエコシステムにおけるサプライチェーン攻撃（Shai-Hulud 2.0等）への対策をまとめる。

## 導入済みの対策

### 1. safe-chain

インストール時にマルウェアを検知するツール。

```bash
# インストール確認
safe-chain --version

# シェル統合確認（~/.zshrcに設定済み）
source ~/.safe-chain/scripts/init-posix.sh
```

- `npm`, `pnpm`, `npx`, `pnpx` コマンドが自動的にsafe-chain経由で実行される
- ダウンロード時にマルウェアをスキャン

### 2. ignore-scripts=true

ライフサイクルスクリプト（preinstall, postinstall等）の実行を無効化。

```bash
# ~/.npmrc（グローバル設定）
ignore-scripts=true
```

**ブロックされるスクリプト:**
- preinstall
- install
- postinstall
- prepublish
- prepare

**注意:** ネイティブビルドが必要なパッケージ（esbuild, sharp等）は `pnpm rebuild` が必要な場合がある。

### 3. minimum-release-age=2w

新規リリースから2週間経過したパッケージのみインストール可能。

```bash
# 各プロジェクトの .npmrc
minimum-release-age=2w
```

攻撃者が悪意あるバージョンを公開しても、2週間の猶予期間中に検知・削除される可能性が高い。

### 4. バージョン完全固定

package.jsonから `^` と `~` を削除し、完全なバージョン指定に変更。

```json
// Before
"react": "^19.1.0"

// After
"react": "19.1.0"
```

意図しないバージョンアップを防止。

## セキュリティスキャンツール

### ツール比較

| ツール | install前 | install済み | lockファイル | マルウェア | CVE | 無料 |
|--------|:---------:|:-----------:|:------------:|:----------:|:---:|:----:|
| safe-chain | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| pnpm audit | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| trivy | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Socket CLI | ✅ | ✅ | ✅ | ✅ | ✅ | △ |

### pnpm audit

既知の脆弱性（CVE）をlockファイルから検出。

```bash
pnpm audit
```

### trivy

ファイルシステムスキャン（CVE検出）。

```bash
trivy fs --scanners vuln,secret .
```

### Socket CLI（検討中）

唯一、install済みnode_modulesのマルウェアスキャンが可能。

```bash
npx @socketsecurity/cli scan
```

## 手動マルウェアチェック

既知のマルウェアパターン（Shai-Hulud等）を手動で検索。

```bash
# Shai-Huludマルウェアファイル検索
grep -r "setup_bun.js\|bun_environment.js" node_modules/
find node_modules -name "bun_environment.js" -o -name "setup_bun.js"
```

**限界:** 既知のパターンのみ検出可能。新種のマルウェアには対応できない。

## 攻撃情報の確認

### Shai-Hulud 2.0 被害パッケージリスト

```bash
# Wizの公開CSVから確認
curl -s "https://raw.githubusercontent.com/wiz-sec-public/wiz-research-iocs/refs/heads/main/reports/shai-hulud-2-packages.csv"
```

### パッケージの公式修正報告

攻撃されたパッケージの修正状況は、各パッケージのGitHub Issuesで確認。

例: https://github.com/asyncapi/spec-json-schemas/issues/603

## 依存関係の調査

特定パッケージがなぜ依存に含まれているか確認:

```bash
pnpm why <package-name>
```

## 参考リンク

- [Wiz Blog - Shai-Hulud 2.0](https://www.wiz.io/blog/shai-hulud-2-0-ongoing-supply-chain-attack)
- [GitLab Advisory Database](https://advisories.gitlab.com/)
- [Socket.dev](https://socket.dev/)
- [safe-chain](https://github.com/AikidoSec/safe-chain)
