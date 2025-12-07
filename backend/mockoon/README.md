# Mockoon Mock Server Integration Guide

## 概要

Mockoonは外部API（決済、SMS等）をモックするためのツールです。開発環境・テスト環境で実際の外部APIを呼び出さずに、ローカルでモックレスポンスを返すことができます。

---

## 📂 ディレクトリ構成

```
backend/mockoon/
├── README.md                    # このファイル
├── environments/
│   ├── dev.json                 # 開発環境用（Faker.js、動的レスポンス）
│   └── test.json                # テスト環境用（決定的レスポンス）
└── scripts/
    └── generate-from-dto.gradle # DTO → Mockoon JSON生成スクリプト（オプション）
```

---

## 🚀 使い方

### 1. Mockoonを起動

#### 方法A: Docker Composeで起動（推奨）

```bash
# プロジェクトルートから
make mockoon-start

# または
cd backend
docker-compose up -d mockoon
```

- **URL**: http://localhost:3001
- **Admin API**: http://localhost:3001/__admin
- **環境**: `dev.json` を使用

#### 方法B: CLIで直接起動（ホットリロード有効）

```bash
# 開発環境
make mockoon-dev

# テスト環境
make mockoon-test
```

#### 停止

```bash
make mockoon-stop
# または
cd backend && docker-compose stop mockoon
```

---

### 2. モックAPIを呼び出す

#### Payment API

```bash
# 成功レスポンス（デフォルト）
curl -X POST http://localhost:3001/api/payment \
  -H "Content-Type: application/json" \
  -d '{"amount": 99.99}'

# レスポンス例:
# {
#   "transactionId": "TXN-abc123...",
#   "amount": 99.99,
#   "status": "SUCCESS",
#   "responseCode": "200",
#   "message": "Transaction successful",
#   "processedAt": "2025-12-07T12:34:56Z"
# }

# 拒否レスポンス
curl -X POST "http://localhost:3001/api/payment?scenario=declined" \
  -H "Content-Type: application/json" \
  -d '{"amount": 99.99}'

# タイムアウト（31秒後に504エラー）
curl -X POST "http://localhost:3001/api/payment?scenario=timeout" \
  -H "Content-Type: application/json" \
  -d '{"amount": 99.99}'
```

#### SMS API

```bash
# 成功レスポンス
curl -X POST http://localhost:3001/api/sms \
  -H "Content-Type: application/json" \
  -d '{"to": "+1234567890", "message": "Hello"}'

# 無効な番号エラー
curl -X POST "http://localhost:3001/api/sms?scenario=invalid" \
  -H "Content-Type: application/json" \
  -d '{"to": "invalid", "message": "Hello"}'
```

---

### 3. バックエンドから呼び出す

#### 環境変数設定

```bash
# backend/.env
MOCKOON_ENABLED=true
EXTERNAL_API_PAYMENT_URL=http://localhost:3001/api/payment
EXTERNAL_API_SMS_URL=http://localhost:3001/api/sms
```

#### Javaコード例

```java
@Service
public class PaymentService {
  private final AppProperties appProperties;
  private final RestTemplate restTemplate;

  public PaymentResponse processPayment(BigDecimal amount) {
    if (!appProperties.getMockoon().isEnabled()) {
      // 本番環境: 実際の決済APIを呼び出す
      // ...
    }

    // 開発/テスト環境: Mockoonを呼び出す
    String url = appProperties.getExternalApi().getPaymentUrl();
    PaymentRequest request = new PaymentRequest(amount);

    return restTemplate.postForObject(url, request, PaymentResponse.class);
  }
}
```

---

## 🔄 DTO → Mockoon 連携方法

### Approach 1: OpenAPI経由（推奨）

#### Step 1: DTOにアノテーション追加

```java
@Schema(
    name = "PaymentResponse",
    description = "External payment API response"
)
public record PaymentResponse(
    @Schema(
        description = "Unique transaction identifier",
        example = "TXN-2024120700001"  // ← この example がMockoonで使われる
    )
    String transactionId,

    @Schema(
        description = "Transaction amount",
        example = "99.99"
    )
    BigDecimal amount,

    @Schema(
        description = "Payment status",
        example = "SUCCESS"
    )
    PaymentStatus status
) {}
```

#### Step 2: OpenAPI生成

```bash
cd backend
./gradlew generateOpenApiDocs
# → backend/openapi/customer-api.json が生成される
```

#### Step 3: Mockoon Desktopでインポート

1. [Mockoon Desktop](https://mockoon.com/download/)をダウンロード
2. アプリを開く
3. `File > Import OpenAPI specification`
4. `backend/openapi/customer-api.json` を選択
5. Mockoonが自動的に:
   - エンドポイントを作成
   - DTOの`example`値をレスポンスボディに設定
   - スキーマから型を推論
6. 必要に応じて編集（シナリオ追加、Faker.js使用等）
7. `File > Export environment`
8. `backend/mockoon/environments/dev.json` に保存
9. Git commit

#### Step 4: 他の開発者が利用

```bash
git pull
make mockoon-start
# → 全員が同じモックレスポンスを使える
```

---

### Approach 2: Gradle Taskで自動生成（高度）

DTOから直接Mockoon JSONを生成するスクリプトを作成できます。

#### 実装例（オプション）

**`backend/buildSrc/src/main/groovy/GenerateMockoonTask.groovy`**

```groovy
import com.fasterxml.jackson.databind.ObjectMapper
import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction

class GenerateMockoonTask extends DefaultTask {

    @TaskAction
    void generate() {
        def mapper = new ObjectMapper()

        // DTOインスタンスを作成
        def paymentResponse = [
            transactionId: "TXN-TEST-001",
            amount: 99.99,
            status: "SUCCESS",
            responseCode: "200",
            message: "Transaction successful",
            processedAt: "2025-01-01T00:00:00Z"
        ]

        // Mockoon形式に変換
        def mockoonEnv = [
            uuid: "generated-environment",
            name: "Generated from DTOs",
            port: 3001,
            routes: [
                [
                    uuid: "payment-api",
                    method: "post",
                    endpoint: "api/payment",
                    responses: [
                        [
                            uuid: "payment-success",
                            statusCode: 200,
                            body: mapper.writeValueAsString(paymentResponse)
                        ]
                    ]
                ]
            ]
        ]

        // ファイルに書き出し
        def outputFile = new File("${project.projectDir}/mockoon/environments/generated.json")
        outputFile.text = mapper.writerWithDefaultPrettyPrinter()
            .writeValueAsString(mockoonEnv)

        println "Generated: ${outputFile.absolutePath}"
    }
}
```

**`backend/build.gradle`**

```gradle
task generateMockoon(type: GenerateMockoonTask) {
    description = 'Generate Mockoon environment from DTOs'
    group = 'mockoon'
}
```

**使い方:**

```bash
./gradlew generateMockoon
# → backend/mockoon/environments/generated.json が生成される
```

---

## 📝 環境ファイルの編集

### dev.json（開発環境）

- **動的レスポンス**: Faker.jsを使用
- **複数シナリオ**: クエリパラメータで切り替え
- **レイテンシ**: 50ms〜31000ms

**編集方法:**

1. Mockoon Desktopで開く
2. ルートを選択
3. レスポンスを編集
4. ルールを追加（`scenario=declined`等）
5. 保存 → Git commit

### test.json（テスト環境）

- **決定的レスポンス**: 固定値のみ
- **レイテンシ**: 0ms（高速）
- **E2Eテスト用**: 予測可能な結果

---

## 🧪 E2Eテストでの使用

### Playwrightから制御（将来実装）

```typescript
// frontend_web/e2e/steps/payment.steps.ts
import { Given } from '@cucumber/cucumber';
import { mockoonClient } from '../support/mockoon-client';

Given('決済APIがエラーを返す', async () => {
  await mockoonClient.stubError('/api/payment', 402, 'card_declined');
});
```

### テスト実行

```bash
# Mockoon起動
make mockoon-test

# E2Eテスト実行
make web-e2e
```

---

## 🔧 トラブルシューティング

### Mockoonが起動しない

```bash
# ポート3001が既に使用されているか確認
lsof -ti :3001

# 使用中のプロセスを終了
lsof -ti :3001 | xargs kill -9

# 再起動
make mockoon-start
```

### Admin APIにアクセスできない

```bash
# ヘルスチェック
curl http://localhost:3001/__admin/health

# Mockoonのログを確認
make mockoon-logs
```

### DTOを変更したらモックレスポンスがずれた

```bash
# OpenAPI再生成
cd backend
./gradlew generateOpenApiDocs

# Mockoon Desktopで再インポート
# File > Import OpenAPI specification > customer-api.json

# 保存してコミット
git add mockoon/environments/dev.json
git commit -m "Update Mockoon responses for DTO changes"
```

---

## 📚 参考資料

- [Mockoon公式ドキュメント](https://mockoon.com/docs/latest/about/)
- [Mockoon CLI](https://mockoon.com/docs/latest/mockoon-cli/overview/)
- [Templating with Faker.js](https://mockoon.com/docs/latest/templating/overview/)
- [OpenAPI import](https://mockoon.com/docs/latest/openapi/import-export-openapi-format/)

---

## 💡 ベストプラクティス

1. **DTOを変更したら必ずOpenAPI再生成** → Mockoon再インポート
2. **dev.jsonにはFaker.js使用** → リアルなテストデータ
3. **test.jsonは決定的** → E2Eテストの安定性向上
4. **シナリオ活用** → エラーケース、タイムアウト等をクエリパラメータで切り替え
5. **Git管理** → チーム全員が同じモック定義を共有

---

## 🎯 次のステップ

1. ✅ Mockoon Desktop インストール
2. ✅ OpenAPI生成 → インポート
3. ✅ dev.json編集・保存
4. ✅ Git commit
5. ✅ チームメンバーが`make mockoon-start`で即利用可能

---

質問や問題があれば、プロジェクトのIssueまたはSlackで報告してください。
