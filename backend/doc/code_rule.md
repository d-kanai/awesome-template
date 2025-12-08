[重要]backendのコーディングは以下を遵守すること

## common

- 基本コード質
  - 基本全ての変数にfinalがついていること
  - メソッド30行以内
  - ローカル変数・パラメータは基本final宣言
  - 認知・循環複雑度15以内
  - deep nest 2以内
- 同時リクエスト・スレッド使い回しで問題になる可能性があるコードは検知してユーザに質問すること
  - 非finalなstatic変数（複数スレッドで共有される）
  - Singleton Beanのmutableフィールド（全リクエストで共有される）
  - ThreadLocalのクリア忘れ（スレッド再利用時に前の値が残る）
- ログ出力は `AppLogger` を使用すること（`LoggerFactory.getLogger()` 禁止）
- 論理的凝集でなく、機能的凝集を優先すること（カプセル化）
  - 技術的分類（「定数である」「ユーティリティである」）でなく、ビジネス機能・ドメイン・責務（「Cookie管理」「認証」）で分類する
  - 例：Cookie定数とCookie操作を同じCookieManagerクラスに持つ。定数だけを集めたファイルには持たせない
  - 例：table定義をfeatureごとにもつ

### 命名規則
- 取得系: Find〜 (例: FindMe, FindAllUsers, FindUserById)
- 更新/作成/削除系: ビジネス上の振る舞い名を使う（例: Signup, Signin, PublishArticle, CancelOrder）
- CRUD名（Create, Update, Delete）は避ける

### 環境変数
- 環境変数はデフォルト値を指定しない（例: `${KAFKA_ENABLED}` ○、`${KAFKA_ENABLED:false}` ×）
- すべての環境変数は `.env` ファイルで一元管理する
- 環境変数は基本的に必須とし、未設定の場合は起動時エラーとする

### 冪等性（Kafka Consumer / Job 等）
- **INSERT**: Insert-firstパターン（`onDuplicateKeyIgnore()`）
- **UPDATE**: `SELECT FOR UPDATE`（悲観ロック）
- 特にConsumer, Jobは同時リクエストがされる前提で作ること

## code

### presentation層
- 構成
  - `presentation/rest`: REST API（XxxRestApi）
  - `presentation/consumer`: Kafkaコンシューマ（XxxConsumer）
  - `presentation/job`: バッチジョブ（XxxJob）

#### REST API
- 1クラス 1API 1publicメソッド
  - クラス名 = ユースケース名 + RestApi（例: SignupRestApi, SigninRestApi, FindMeRestApi）
  - CRUDを1つのクラスにまとめない
  - Output.from() メソッドは Command/Query の Output を引数に取ること

#### Consumer
- 実行方法: `--spring.main.web-application-type=none --mode=consumer`
- 構成
  - `presentation/consumer/XxxConsumer.java`: 各Consumer実装
- Consumer実装ルール
  - `@Component` + `@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true")` で宣言
  - `@KafkaListener` でトピックを購読（groupIdはアプリ名+機能名: `${spring.application.name}-notification`）
  - 1Consumer = 1イベントタイプ（1メソッド）
  - Consumerはイベント受信とログ出力のみ、ビジネスロジックはCommandに委譲
  - 命名: `{イベント名}Consumer`（例: `UserSignedUpConsumer`）

#### Job
- 実行方法: `--spring.main.web-application-type=none --job=jobName --dryRun=true --arg1=value1`
- 構成
  - `presentation/job/XxxJob.java`: 各Job実装
- Job実装ルール
  - `@Component("jobName")` でBean名を指定（CLI引数の `--job=jobName` で指定）
  - `Job<T extends Job.Args>` を implements
  - 内部に `record Args(@NotNull Boolean dryRun, ...) implements Job.Args {}` を定義
  - `dryRun` は全Jobで必須（`@NotNull Boolean`）
  - Job固有の引数は `@NotNull` 等でバリデーション（未指定なら起動時エラー）

### application層
- command, queryは1クラス1publicメソッド
- Command/Query は必ず Output record クラスを持つこと
- Output の field に Domain Model を含めてよい（プリミティブへの変換は不要）
- HTTP レスポンス形式への変換は Presentation 層で行う
- 意味がわかる単位でprivateメソッドに切り出す
  - 例: `ensureEmailNotOwnedByAnother(email, user)` - 重複メールチェック
  - メソッド名で意図が伝わるようにする（コメント不要になるレベル）
- トランザクション管理
  - Query: `@Transactional(readOnly = true)` を付ける（DB最適化、一貫性保証）
  - Command: DB書き込みあり → `@Transactional`、読み取りのみ → `@Transactional(readOnly = true)`
  - 例: SigninCommand は認証処理だがDB書き込みなし → `readOnly = true`

### domain層
- Entity: mutableでOK（状態変更メソッドでフィールドを直接変更）
- ValueObject: immutable（フィールドは全てfinal）
- setterは使用禁止（状態変更はビジネス上の振る舞いメソッド経由）
- updateXxx ではなく、ビジネス上の振る舞いの言葉を使う（例: `changePassword`, `activate`, `cancel`）
- コンストラクタはprivate、static factoryメソッドで生成
- 完全コンストラクタパターン（コンストラクタ内でバリデーションを行い、不正なインスタンスを生成させない）
- DomainModelを継承してSnapshot Patternによるdirty tracking機能を使う
  - `reconstruct()`で`captureSnapshot()`を呼び、ロード時点の状態を保存
  - 状態変更メソッドではフィールドを直接変更するだけでOK（自動で差分検出）

#### DomainEvent と CommandEvent

**重要: 用語の使い分け**
- `DomainEvent` と `CommandEvent` は明確に別物として扱う
- 単独の `event` や `command` という用語は混乱を招くため避ける

| 種類 | 用途 | 購読者数 | Payload 定義者 | 命名 |
|------|------|----------|----------------|------|
| **DomainEvent** | 事実の通知（〜した） | 1:N（複数） | 発行側 | `XxxEvent` |
| **CommandEvent** | 処理の依頼（〜しろ） | 1:1（単一） | 受信側 | `XxxCommandEventInput` |

#### Domainイベント発行パターン
- Entityの状態変更メソッド内で `registerDomainEvent()` を呼ぶ
- CommandでDB保存後に `eventPublisher.publishAllDomainEvents(entity.getDomainEvents())` を呼ぶ

### infrastructure層
- Repository命名規則
  - 取得: `findByXxx`
  - 挿入: `insert`
  - 更新: `update`
  - 削除: `deleteById`
- `insert`は`void`、影響行数0なら例外をスロー
- `update`は`void`、影響行数0なら例外をスロー
- dirty trackingで変更フィールドのみUPDATE
  - `@DbRecordUpdateLog` アノテーションでDB更新の監査ログを自動出力

### sharedモジュール
- `shared/` 配下のクラスは全featureモジュールから参照可能

### エラーハンドリング
- 各層で専用の例外クラスを使用する
  - Application層: `ApplicationLayerException` → 400
  - Domain層: `DomainLayerException` → 400
  - Infrastructure層: `InfraLayerException` → 500
- GlobalExceptionHandlerが全例外を処理
  - `MethodArgumentNotValidException`（Spring @Valid） → 400
  - `ApplicationLayerException` → 400（メッセージをレスポンスに含める）
  - `DomainLayerException` → 400（メッセージをレスポンスに含める）
  - `InfraLayerException` → 500（ログ出力）
  - `Exception` → 500（ログ出力）

## test
- カバレッジ90%以上
- testメソッド名は日本語でテストの意図が明確な名前にすること
- testメソッド名は日本語を体言止めを使う
- given when thenのコメントを挿入してフェーズを見やすくすること
- 1 API = 1 テストファイルのため、メソッド名にAPI名のプレフィックスは不要
- テストデータ作成には `testsupport/databuilder/` のビルダーを使用
  - `aUser().save()` - デフォルト値で保存
  - `aUser().email("x@example.com").save()` - 値を上書きして保存
  - ビルダーは `@Autowired` でDIし、static import `aUser()` で使用
- Api in-out Test (レイヤ・DBモックなし)
  - Query
    - Given: 関連データ 0reset, TestBuilderでデータ準備
    - When: call api
    - Then: assert all response
  - Command
    - Given: 関連データ 0reset, TestBuilderでデータ準備
    - When: call api
    - Then: assert response & db change & event publish
- Consumer, Job Test
  - API Testと同様、presentationからのテストで、モック禁止・Springコンテキストで本物のRepository使用
  - Given: 関連データ 0reset（`dsl.deleteFrom(TABLE).execute()`）、TestBuilderでデータ準備
  - When: `consumer|job exec`
  - Then: assert response & db change