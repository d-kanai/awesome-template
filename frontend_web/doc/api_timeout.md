# ⏱️ API Timeout

## 📋 概要

全APIリクエストに**自動タイムアウト**を設定。ネットワーク遅延・サーバー無応答による無限待機を防止。

| 項目 | 値 |
|------|-----|
| デフォルト | 30秒 |
| 本番推奨 | 15秒 |
| 重い処理 | 60秒 |

## ⚙️ 設定

### 環境変数（グローバル）

```bash
NEXT_PUBLIC_API_TIMEOUT_MS=30000
```

### リクエスト単位

```typescript
await someApi(data, { timeout: 60000 });  // 60秒
```

## 🔍 タイムアウト判定

```typescript
import { TimeoutError } from "@/shared/lib/timeout";

try {
  await someApi();
} catch (error) {
  if (TimeoutError.isTimeoutError(error)) {
    // タイムアウト専用処理
  }
}
```

## 📊 ログ出力

タイムアウト発生時、自動で記録:
- `method`, `path`, `timeoutMs`, `duration`
- `requestId`, `userId`, `sessionId`

## ✅ ベストプラクティス

| ✅ 推奨 | ❌ 避ける |
|---------|----------|
| デフォルト値を使う | 3秒未満（モバイルで頻発） |
| 環境別に調整 | 120秒超（ユーザー離脱） |
| ログ監視 | エラー握りつぶし |
