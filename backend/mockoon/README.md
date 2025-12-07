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

- **URL**: http://localhost:3002
- **Admin API**: http://localhost:3002/__admin
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
curl -X POST http://localhost:3002/api/payment \
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
curl -X POST "http://localhost:3002/api/payment?scenario=declined" \
  -H "Content-Type: application/json" \
  -d '{"amount": 99.99}'

# タイムアウト（31秒後に504エラー）
curl -X POST "http://localhost:3002/api/payment?scenario=timeout" \
  -H "Content-Type: application/json" \
  -d '{"amount": 99.99}'
```

#### SMS API

```bash
# 成功レスポンス
curl -X POST http://localhost:3002/api/sms \
  -H "Content-Type: application/json" \
  -d '{"to": "+1234567890", "message": "Hello"}'

# 無効な番号エラー
curl -X POST "http://localhost:3002/api/sms?scenario=invalid" \
  -H "Content-Type: application/json" \
  -d '{"to": "invalid", "message": "Hello"}'
```

---

### 3. バックエンドから呼び出す

#### 環境変数設定

```bash
# backend/.env
MOCKOON_ENABLED=true
EXTERNAL_API_PAYMENT_URL=http://localhost:3002/api/payment
EXTERNAL_API_SMS_URL=http://localhost:3002/api/sms
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

## 🔄 DTO → Mockoon 連携方法（CLI Only - Desktop不要）

### ⚡ Quick Start: 3つの自動化アプローチ

すべて**CLI/Gradleのみ**で完結します。Mockoon Desktopは不要です。

---

### Approach 1: OpenAPI → Mockoon CLI（最速・推奨）

Mockoon CLIの`import-openapi`コマンドで自動変換。

#### Step 1: OpenAPI生成

```bash
cd backend
./gradlew generateOpenApiDocs
# → backend/openapi/customer-api.json が生成される
```

#### Step 2: Mockoon CLIでインポート

```bash
# 初回のみ: @mockoon/cli インストール
npm install -g @mockoon/cli

# OpenAPIからMockoon環境ファイルを自動生成
mockoon-cli import-openapi \
  --input ./openapi/customer-api.json \
  --output ./mockoon/environments/generated.json \
  --port 3002

# ✅ generated.json が自動生成される
# DTOの @Schema example 値がレスポンスボディに設定される
```

#### Step 3: 起動してテスト

```bash
# 生成したファイルでMockoon起動
mockoon-cli start \
  --data ./mockoon/environments/generated.json \
  --port 3002

# または Dockerで
docker-compose up -d mockoon
```

#### Step 4: Git commit

```bash
git add mockoon/environments/generated.json
git commit -m "Generate Mockoon from OpenAPI"
git push
```

**メリット:**
- ✅ **GUI不要** - 完全CLI
- ✅ **型安全** - DTOとレスポンスが完全一致
- ✅ **自動同期** - DTO変更時に再生成で即反映
- ✅ **最速** - 1コマンドで完了

---

### Approach 2: Gradle TaskでDTOから直接生成（カスタマイズ可）

Gradleタスクで**DTOインスタンスを直接JSON化**してMockoon形式に変換。

#### Step 1: Gradleタスク実行

```bash
cd backend
./gradlew generateMockoonFromDto
```

出力:
```
✅ Generated Mockoon environment: backend/mockoon/environments/generated-from-dto.json

📝 Next steps:
  1. Review the generated file
  2. Start Mockoon: make mockoon-start
  3. Test: curl -X POST http://localhost:3002/api/payment -d '{"amount":99.99}'
```

#### Step 2: 確認して起動

```bash
# 生成されたファイルを確認
cat mockoon/environments/generated-from-dto.json

# Mockoon起動
mockoon-cli start --data ./mockoon/environments/generated-from-dto.json --port 3002
```

#### カスタマイズ方法

`backend/buildSrc/src/main/groovy/GenerateMockoonFromDtoTask.groovy`を編集:

```groovy
// DTOインスタンスを追加
def newApiResponse = [
    id: "NEW-001",
    name: "Sample",
    createdAt: "2025-01-01T00:00:00Z"
]

// ルートに追加
routes: [
    // ... 既存ルート
    [
        uuid: "new-api",
        method: "get",
        endpoint: "api/new",
        responses: [[
            body: mapper.writeValueAsString(newApiResponse),
            statusCode: 200
        ]]
    ]
]
```

**メリット:**
- ✅ **完全カスタマイズ可** - エラーケース、シナリオ追加自由
- ✅ **GUI不要**
- ✅ **リフレクション対応可** - 将来的に`@Schema`から自動読取可能

---

### Approach 3: 手動JSON編集（既存のdev.json/test.json）

既存の`dev.json`を直接編集する場合。

```bash
# VSCodeやvimで編集
vim backend/mockoon/environments/dev.json

# JSONフォーマット検証
npx jsonlint backend/mockoon/environments/dev.json

# 起動してテスト
mockoon-cli start --data ./mockoon/environments/dev.json --port 3002
```

---

### 🔄 DTO変更時のワークフロー（Approach 1推奨）

#### 1. DTOを変更

```java
public record PaymentResponse(
    @Schema(example = "TXN-12345") String transactionId,
    @Schema(example = "199.99") BigDecimal amount,  // ← 変更
    @Schema(example = "SUCCESS") PaymentStatus status,
    @Schema(example = "JPY") String currency  // ← 新規追加
) {}
```

#### 2. OpenAPI再生成 → Mockoon再生成

```bash
cd backend

# 1コマンドで完結
./gradlew generateOpenApiDocs && \
mockoon-cli import-openapi \
  --input ./openapi/customer-api.json \
  --output ./mockoon/environments/generated.json \
  --port 3002

# または Makefile追加して
make mockoon-regenerate
```

#### 3. Git commit

```bash
git add mockoon/environments/generated.json
git commit -m "Update Mockoon for PaymentResponse changes"
```

---

### 🎯 推奨設定（Makefile追加）

`Makefile`に以下を追加すると便利:

```makefile
# Mockoonセクションに追加
mockoon-regenerate:
	cd backend && ./gradlew generateOpenApiDocs
	mockoon-cli import-openapi \
		--input backend/openapi/customer-api.json \
		--output backend/mockoon/environments/generated.json \
		--port 3002
	@echo "✅ Mockoon regenerated from OpenAPI"
	@echo "📝 Review: backend/mockoon/environments/generated.json"
	@echo "🚀 Start: make mockoon-start"
```

使い方:
```bash
# DTO変更後、1コマンドで再生成
make mockoon-regenerate

# Mockoon起動
make mockoon-start
```

---

### Approach 1 vs 2 vs 3 比較

| 項目 | Approach 1 (OpenAPI CLI) | Approach 2 (Gradle) | Approach 3 (手動) |
|------|--------------------------|---------------------|-------------------|
| **GUI必要?** | ❌ 不要 | ❌ 不要 | ❌ 不要 |
| **自動化** | ⭐⭐⭐⭐⭐ 完全自動 | ⭐⭐⭐⭐ ほぼ自動 | ⭐⭐ 手動 |
| **型安全** | ✅ DTOと完全一致 | ✅ DTOと完全一致 | ⚠️ 手動保証 |
| **カスタマイズ** | ⭐⭐⭐ 後から編集 | ⭐⭐⭐⭐⭐ 完全自由 | ⭐⭐⭐⭐⭐ 完全自由 |
| **速度** | ⚡ 最速（1コマンド） | ⚡ 高速 | 🐢 遅い |
| **メンテナンス** | ⭐⭐⭐⭐⭐ 超簡単 | ⭐⭐⭐⭐ 簡単 | ⭐⭐ 面倒 |
| **推奨度** | ✅ **最推奨** | ✅ 高度なカスタマイズ時 | △ 緊急時のみ |

---

### 🛠️ Approach 1 詳細設定

#### OpenAPI → Mockoon変換オプション

```bash
mockoon-cli import-openapi \
  --input ./openapi/customer-api.json \
  --output ./mockoon/environments/generated.json \
  --port 3002 \
  --prefix "/api/v1"  # URLプレフィックス追加
```

#### 生成後のカスタマイズ

生成されたJSONを直接編集してシナリオ追加:

```bash
# 生成後にエラーシナリオ追加
vim mockoon/environments/generated.json

# "responses"配列に追加:
{
  "uuid": "payment-error",
  "statusCode": 500,
  "body": "{\"error\": \"Server error\"}",
  "rules": [{
    "target": "query",
    "modifier": "scenario",
    "value": "error",
    "operator": "equals"
  }]
}
```

---

### Approach 1: OpenAPI経由（Desktop版の説明 - 参考用）

**注意: 以下はMockoon Desktopを使う場合の説明です。上記のCLIアプローチを推奨します。**

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
            port: 3002,
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
# ポート3002が既に使用されているか確認
lsof -ti :3002

# 使用中のプロセスを終了
lsof -ti :3002 | xargs kill -9

# 再起動
make mockoon-start
```

### Admin APIにアクセスできない

```bash
# ヘルスチェック
curl http://localhost:3002/__admin/health

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
