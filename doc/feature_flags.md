# フィーチャーフラグ使用ガイド

このドキュメントでは、Unleashを使用したフィーチャーフラグ管理の使い方を説明します。

## アーキテクチャ

```
React Native App ──┐
                   ├──→ Spring Boot (Proxy機能内蔵) ──→ Unleash Server
Next.js Web ───────┘         ↓
                         (直接SDK使用)
```

- **Unleash Server**: フィーチャーフラグの管理UI・APIサーバー
- **Spring Boot**: Unleash SDK統合 + Proxyエンドポイント提供
- **React Native**: Unleash Proxy Client経由でフラグ取得

## セットアップ

### 1. Unleashサーバーの起動

ローカル開発環境でUnleashサーバーを起動します：

```bash
make unleash-up
```

Unleash UIにアクセス：
```bash
make unleash-open
# または http://localhost:4242 をブラウザで開く
```

デフォルトログイン情報:
- Username: `admin`
- Password: `unleash4all`

### 2. Unleashサーバーの停止

```bash
make unleash-down
```

## フィーチャーフラグの作成

1. Unleash UIにログイン (http://localhost:4242)
2. 「New toggle」をクリック
3. フラグ名と説明を入力（例: `new-feature`, `experimental-ui`）
4. 有効化戦略を選択
   - `default`: 全ユーザーで有効/無効を切り替え
   - `userWithId`: 特定ユーザーIDのみ有効
   - `gradualRollout`: 段階的なロールアウト
5. 「Save」をクリック

## 使用方法

### Spring Boot (Backend)

#### 1. サービス層での使用

```java
@Service
public class MyService {
  private final FeatureFlagService featureFlagService;

  public MyService(final FeatureFlagService featureFlagService) {
    this.featureFlagService = featureFlagService;
  }

  public void doSomething() {
    // シンプルなフラグチェック
    if (featureFlagService.isEnabled("new-feature")) {
      // 新機能の処理
    } else {
      // 既存の処理
    }

    // ユーザーIDを指定してチェック
    if (featureFlagService.isEnabled("experimental-ui", userId)) {
      // 特定ユーザー向けUI
    }

    // デフォルト値を指定
    final boolean enabled = featureFlagService.isEnabled(
      "beta-feature",
      userId,
      false  // フラグが存在しない場合のデフォルト値
    );
  }
}
```

#### 2. コントローラー層での使用

```java
@RestController
public class MyController {
  private final FeatureFlagService featureFlagService;

  public MyController(final FeatureFlagService featureFlagService) {
    this.featureFlagService = featureFlagService;
  }

  @GetMapping("/api/data")
  public ResponseEntity<Data> getData() {
    if (featureFlagService.isEnabled("new-api-version")) {
      return ResponseEntity.ok(getDataV2());
    }
    return ResponseEntity.ok(getDataV1());
  }
}
```

### React Native (Frontend)

#### 1. プロバイダーの設定

アプリのルートコンポーネントで`FeatureFlagProvider`をラップします：

```tsx
import { FeatureFlagProvider } from "@/features/shared/contexts/FeatureFlagContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <FeatureFlagProvider>
        <App />
      </FeatureFlagProvider>
    </AuthProvider>
  );
}
```

#### 2. フックでの使用

```tsx
import { useFeatureFlag } from "@/features/shared/hooks/useFeatureFlag";

function MyComponent() {
  const isNewFeatureEnabled = useFeatureFlag('new-feature');
  const isExperimentalUIEnabled = useFeatureFlag('experimental-ui');

  return (
    <View>
      {isNewFeatureEnabled ? (
        <NewFeature />
      ) : (
        <OldFeature />
      )}

      {isExperimentalUIEnabled && (
        <ExperimentalUI />
      )}
    </View>
  );
}
```

#### 3. 条件付きレンダリング

```tsx
import { useFeatureFlag } from "@/features/shared/hooks/useFeatureFlag";

function FeatureScreen() {
  const isBetaEnabled = useFeatureFlag('beta-feature');

  if (!isBetaEnabled) {
    return <ComingSoonScreen />;
  }

  return <BetaFeatureScreen />;
}
```

## 設定

### Backend設定 (application.yml)

```yaml
unleash:
  enabled: true  # Unleashを有効化/無効化
  api-url: ${UNLEASH_API_URL:http://localhost:4242/api}
  api-token: ${UNLEASH_API_TOKEN:default:development.unleash-insecure-api-token}
  app-name: ${UNLEASH_APP_NAME:awesome-template-backend}
  environment: ${UNLEASH_ENVIRONMENT:development}
```

テスト環境では`unleash.enabled: false`を設定すると、Unleash Beanが作成されず、全てのフラグが`false`を返します。

### Frontend設定

`frontend_native/features/shared/api/featureFlagClient.ts`で設定します：

```typescript
export const unleashConfig: IConfig = {
  url: `${apiBaseUrl}/featureflags/proxy`,
  clientKey: "proxy",
  refreshInterval: 60,  // ポーリング間隔（秒）- 本番環境では60-300秒を推奨
  appName: "awesome-template-native",
  environment: "development",
};
```

## パフォーマンス最適化

### ポーリング間隔の設定

**現在の設定**: 60秒（1分）

**推奨値**:
- **開発環境**: 15-30秒（高速なテストのため）
- **本番環境**: 60-300秒（1-5分、サーバー負荷を考慮）

**負荷計算例**:
```
リクエスト数/分 = ユーザー数 × (60 / refreshInterval秒)

例: 1000ユーザー, 60秒間隔
→ 1000 × (60/60) = 1000リクエスト/分

例: 1000ユーザー, 15秒間隔
→ 1000 × (60/15) = 4000リクエスト/分
```

**トレードオフ**:
- **短い間隔（15-30秒）**: リアルタイム性が高い、サーバー負荷大
- **長い間隔（120-300秒）**: サーバー負荷小、フラグ変更の反映が遅い
- **推奨（60秒）**: バランスが取れている

フィーチャーフラグは頻繁に変更するものではないため、60秒以上の間隔で十分なケースが多いです。

## ベストプラクティス

### 1. フラグ命名規則

- **kebab-case**を使用: `new-feature`, `experimental-ui`
- **プレフィックス**で分類:
  - `beta-`: ベータ機能
  - `experiment-`: A/Bテスト
  - `rollout-`: 段階的ロールアウト
- **具体的な名前**を付ける: `enable-payment` より `enable-stripe-payment`

### 2. フラグの削除

フィーチャーが完全に展開されたら、フラグを削除してコードをクリーンに保ちます：

1. Unleash UIでフラグを無効化
2. コードから条件分岐を削除し、新機能を標準化
3. Unleash UIでフラグを完全に削除

### 3. テスト環境でのフラグ管理

- `application-test.yml`では`unleash.enabled: false`を設定
- ユニットテストではモックを使用
- E2Eテストでは専用のテストフラグを作成

## トラブルシューティング

### Unleashサーバーに接続できない

```bash
# Unleashサーバーのログを確認
docker logs unleash-server

# Unleashサーバーを再起動
make unleash-down
make unleash-up
```

### フラグが反映されない

- ブラウザでUnleash UI (http://localhost:4242) にアクセスし、フラグが有効か確認
- Proxyエンドポイント (http://localhost:8080/featureflags/proxy) をcurlで確認
- React Nativeアプリを再起動（デバッグ時はポーリング間隔を短く設定）

### テストが失敗する

- `application-test.yml`で`unleash.enabled: false`が設定されているか確認
- モックが正しく設定されているか確認

## 参考リンク

- [Unleash公式ドキュメント](https://docs.getunleash.io/)
- [Unleash Java SDK](https://docs.getunleash.io/reference/sdks/java)
- [Unleash Proxy Client React](https://docs.getunleash.io/reference/sdks/react)
