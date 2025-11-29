# API Timeout 機構

## 概要

全てのAPIリクエストに自動的にタイムアウトが設定され、ネットワーク遅延やサーバー無応答による無限待機を防止します。

## 機能

- ✅ **自動タイムアウト**: 全APIリクエストにデフォルト30秒のタイムアウト
- ✅ **柔軟な設定**: 環境変数・リクエスト単位でタイムアウト時間を調整可能
- ✅ **AbortController利用**: ネイティブAPIを使用した効率的なキャンセル処理
- ✅ **詳細ログ**: タイムアウト発生時の詳細情報をログに記録
- ✅ **ユーザーフレンドリー**: わかりやすいエラーメッセージ
- ✅ **Type Safe**: TypeScriptによる型安全なエラーハンドリング

## 設定方法

### 環境変数（グローバル設定）

`.env.local` ファイルに以下を追加:

```bash
# APIタイムアウト設定（ミリ秒）
NEXT_PUBLIC_API_TIMEOUT_MS=30000  # 30秒（デフォルト）
```

**推奨値**:
- **開発環境**: 30000ms (30秒)
- **本番環境**: 15000ms (15秒) - ユーザー体験を考慮
- **重い処理**: 60000ms (60秒) - 大量データ処理など

### リクエスト単位の設定

特定のAPIリクエストだけタイムアウト時間を変更したい場合:

```typescript
// features/user/queries/getAllUsers.ts
export const getAllUsers = cache(async () => {
  const response = await getAllUsersApi({
    cache: "no-store",
    timeout: 60000,  // このリクエストだけ60秒
  });
  return response.data || [];
});
```

## 使用例

### 1. 基本的な使用（自動適用）

**何もする必要はありません**。全てのAPIリクエストに自動的にタイムアウトが適用されます。

```typescript
// features/auth/actions/signin.ts
export async function signinAction(data: SigninFormData) {
  try {
    // 自動的に30秒のタイムアウトが設定される
    const response = await signinApi(validatedData.data);
    // ...
  } catch (error) {
    // タイムアウトエラーも含めて適切なメッセージが返される
    return { error: (error as Error).message };
  }
}
```

### 2. タイムアウトエラーの判定

```typescript
import { TimeoutError } from "@/shared/lib/timeout";

try {
  const response = await someApi();
} catch (error) {
  if (TimeoutError.isTimeoutError(error)) {
    // タイムアウト専用の処理
    console.error("Timeout:", error.timeoutMs, "ms");
    // ユーザーにリトライを促す、など
  } else {
    // その他のエラー処理
  }
}
```

### 3. カスタムタイムアウト付きAPI呼び出し

```typescript
// 大容量ファイルアップロードなど、時間がかかる処理
export async function uploadLargeFile(file: File) {
  try {
    const response = await uploadApi(
      { file },
      {
        timeout: 120000,  // 2分
      }
    );
    return response;
  } catch (error) {
    if (TimeoutError.isTimeoutError(error)) {
      return {
        error: "ファイルのアップロードに時間がかかりすぎています。ファイルサイズを確認してください。"
      };
    }
    throw error;
  }
}
```

### 4. 汎用的なタイムアウト設定（独自処理）

API以外の処理にもタイムアウトを設定できます:

```typescript
import { withTimeout } from "@/shared/lib/timeout";

// 例: IndexedDBからの読み込みにタイムアウトを設定
async function loadFromIndexedDB() {
  const dbOperation = new Promise((resolve, reject) => {
    // IndexedDB処理...
  });

  return withTimeout(
    dbOperation,
    5000,  // 5秒
    "IndexedDB load"
  );
}
```

## エラーハンドリング

### タイムアウト時のエラー構造

```typescript
{
  message: "リクエストがタイムアウトしました。ネットワーク接続を確認して、再度お試しください。",
  status: 408,  // Request Timeout
  timeout: true,
  timeoutMs: 30000,
}
```

### フロントエンドでの表示例

```typescript
// features/auth/hooks/useSigninForm.ts
export function useSigninForm() {
  const onSubmit = async (data: SigninFormData) => {
    const result = await signinAction(data);

    if (result.error) {
      // タイムアウトエラーの場合、ユーザーに適切なメッセージが表示される
      setSubmitError(result.error);
      // "リクエストがタイムアウトしました。ネットワーク接続を確認して、再度お試しください。"
    }
  };
}
```

## ログ出力

タイムアウト発生時、以下の情報が自動的にログに記録されます:

```json
{
  "level": "error",
  "type": "api_timeout",
  "method": "POST",
  "path": "/auth/signin",
  "timeoutMs": 30000,
  "duration": "30005ms",
  "requestId": "abc123",
  "userId": "user_456",
  "sessionId": "sess_789",
  "err": {
    "type": "Error",
    "message": "リクエストがタイムアウトしました...",
    "stack": "..."
  }
}
```

## パフォーマンスへの影響

- **オーバーヘッド**: 極めて小さい (< 1ms)
- **メモリ**: タイマー1つ分 (数バイト)
- **AbortController**: ネイティブAPI使用のため効率的

## トラブルシューティング

### Q. タイムアウトが短すぎる

**A.** 環境変数を調整:

```bash
# .env.local
NEXT_PUBLIC_API_TIMEOUT_MS=60000  # 60秒に延長
```

### Q. 特定のAPIだけタイムアウトが頻発する

**A.** そのAPIだけタイムアウトを延長:

```typescript
const response = await slowApi(data, { timeout: 90000 });
```

### Q. タイムアウトエラーをリトライしたい

**A.** リトライロジックを追加（今後実装予定）:

```typescript
// 将来的な実装例
import { withRetry } from "@/shared/lib/retry";

const response = await withRetry(
  () => unreliableApi(),
  {
    maxRetries: 3,
    retryableStatuses: [408, 500, 502, 503, 504],
  }
);
```

## ベストプラクティス

### ✅ 推奨

1. **デフォルト値を使う**: ほとんどの場合、デフォルト30秒で十分
2. **環境別に調整**: 本番環境は短め (15秒)、開発環境は長め (30秒)
3. **ログを監視**: タイムアウト頻発は設定見直しやAPI改善のサイン
4. **ユーザーへの通知**: タイムアウト時は明確なメッセージとリトライボタンを提供

### ❌ 避けるべき

1. **極端に短い設定**: 3秒未満はモバイル環境で頻繁にタイムアウト
2. **極端に長い設定**: 120秒超はユーザーが離脱する
3. **無視**: タイムアウトエラーを握りつぶさない（必ずログ記録）

## 技術詳細

### 実装方式

- **AbortController**: ブラウザネイティブAPIでfetchをキャンセル
- **Promise.race**: タイムアウトPromiseとfetchを競争
- **自動クリーンアップ**: finally句でタイマーを確実にクリア

### 型安全性

```typescript
class TimeoutError extends Error {
  public readonly timeoutMs: number;
  public readonly operation: string;

  static isTimeoutError(error: unknown): error is TimeoutError {
    return error instanceof TimeoutError;
  }
}
```

### テスト

包括的なユニットテストを実装済み:
- `features/shared/lib/timeout.spec.ts`
- カバレッジ: 100%

実行:
```bash
pnpm test features/shared/lib/timeout.spec.ts
```

## 関連ドキュメント

- [API Error Handling](./api_error_handling.md) (今後作成予定)
- [Retry Mechanism](./retry_mechanism.md) (今後作成予定)
- [Logging](./logging.md) (今後作成予定)

## 変更履歴

- **2025-11-18**: 初版作成
  - デフォルト30秒タイムアウト実装
  - 環境変数による設定
  - リクエスト単位のカスタマイズ
  - 詳細ログ出力
  - Type guard実装
