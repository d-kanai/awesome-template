# npm/pnpm サプライチェーンセキュリティ セットアップガイド

## 背景

2025年11月、Shai-Hulud 2.0と呼ばれる大規模なnpmサプライチェーン攻撃が発生。796以上のパッケージが侵害され、週間2000万ダウンロード以上に影響。攻撃は`preinstall`スクリプトを悪用し、認証情報の窃取やマルウェアの自動伝播を行った。

## セットアップ手順

### 1. safe-chain のインストール

ダウンロード時にマルウェアを検知するツール。

```bash
npm install -g @aikidosec/safe-chain
safe-chain setup
# シェルを再起動
```

確認:
```bash
safe-chain --version
type pnpm  # "pnpm is a shell function" と表示されればOK
```

### 2. ignore-scripts の設定

ライフサイクルスクリプト（preinstall, postinstall等）の実行を無効化。

```bash
echo "ignore-scripts=true" >> ~/.npmrc
```

確認:
```bash
pnpm config get ignore-scripts  # true
```

### 3. minimum-release-age の設定

新規リリースから2週間経過したパッケージのみインストール可能にする。

各プロジェクトの `.npmrc` に追加:
```ini
minimum-release-age=2w
```

### 4. バージョン完全固定

package.jsonから `^` と `~` を削除し、lockファイルの実バージョンで固定。

```json
// Before
"react": "^19.1.0"

// After
"react": "19.1.0"
```

## セキュリティスキャン

### 定期スキャン

```bash
# CVE検出（lockファイルベース）
pnpm audit

# ファイルシステムスキャン（CVE + シークレット検出）
trivy fs --scanners vuln,secret .
```

### 手動マルウェアチェック

既知のマルウェアパターンを検索:
```bash
grep -r "setup_bun.js\|bun_environment.js" node_modules/
find node_modules -name "bun_environment.js" -o -name "setup_bun.js"
```

### 被害パッケージリストとの照合

```bash
# Shai-Hulud 2.0 被害パッケージCSV
curl -s "https://raw.githubusercontent.com/wiz-sec-public/wiz-research-iocs/refs/heads/main/reports/shai-hulud-2-packages.csv"
```

## ツール比較

| ツール | install前 | install済み | lockファイル | マルウェア | CVE | 無料 |
|--------|:---------:|:-----------:|:------------:|:----------:|:---:|:----:|
| safe-chain | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| pnpm audit | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| trivy | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Socket CLI | ✅ | ✅ | ✅ | ✅ | ✅ | △ |

## 依存関係の調査

特定パッケージがなぜ依存に含まれているか確認:
```bash
pnpm why <package-name>
```

## 参考リンク

- [Wiz Blog - Shai-Hulud 2.0](https://www.wiz.io/blog/shai-hulud-2-0-ongoing-supply-chain-attack)
- [GitLab Advisory Database](https://advisories.gitlab.com/)
- [Socket.dev](https://socket.dev/)
- [safe-chain GitHub](https://github.com/AikidoSec/safe-chain)
