[重要]backendのコーディングは以下を遵守すること

## common

- 基本全ての変数にfinalがついていること
- メソッド30行以内
- ローカル変数・パラメータは基本final宣言
- 認知・循環複雑度15以内
- deep nest 2以内
- 宣言順序（Checkstyle DeclarationOrderで強制）
  1. static fields
  2. instance fields
  3. constructors
  4. public methods
  5. private methods
- 同時リクエスト・スレッド使い回しで問題になる可能性があるコードは検知してユーザに質問すること
  - 非finalなstatic変数（複数スレッドで共有される）
  - Singleton Beanのmutableフィールド（全リクエストで共有される）
  - ThreadLocalのクリア忘れ（スレッド再利用時に前の値が残る）
- 論理的凝集でなく、機能的凝集を優先すること（カプセル化）
  - 技術的分類（「定数である」「ユーティリティである」）でなく、ビジネス機能・ドメイン・責務（「Cookie管理」「認証」）で分類する
  - 例：Cookie定数とCookie操作を同じCookieManagerクラスに持つ。定数だけを集めたファイルには持たせない
  - 例：table定義をfeatureごとにもつ

### 命名規則
- 取得系: Find〜 (例: FindMe, FindAllUsers, FindUserById)
- 更新/作成/削除系: ビジネス上の振る舞い名を使う（例: Signup, Signin, PublishArticle, CancelOrder）
- CRUD名（Create, Update, Delete）は避ける

## code

### presentation層
- 構成
  - `presentation/rest`: REST API（XxxRestApi）
  - `presentation/job`: バッチ処理・スケジュールタスク（XxxJob）
- REST APIは1クラス1API1publicメソッド
  - クラス名 = ユースケース名 + RestApi（例: SignupRestApi, SigninRestApi, FindMeRestApi）
  - CRUDを1つのクラスにまとめない
  - Output.from() メソッドは Command/Query の Output を引数に取ること

### application層
- command, queryは1クラス1publicメソッド
- Command/Query は必ず Output record クラスを持つこと
- Output の field に Domain Model を含めてよい（プリミティブへの変換は不要）
- HTTP レスポンス形式への変換は Presentation 層で行う
- トランザクション管理
  - Query: `@Transactional(readOnly = true)` を付ける（DB最適化、一貫性保証）
  - Command: DB書き込みあり → `@Transactional`、読み取りのみ → `@Transactional(readOnly = true)`
  - 例: SigninCommand は認証処理だがDB書き込みなし → `readOnly = true`

### domain層
- フィールドは全てfinal（イミュータブル）
- setterは使用禁止
- updateXxx ではなく、ビジネス上の振る舞いの言葉を使う（例: `changePassword`, `activate`, `cancel`）
- コンストラクタはprivate、static factoryメソッドで生成
- 完全コンストラクタパターン（コンストラクタ内でバリデーションを行い、不正なインスタンスを生成させない）
- DomainModelを継承してdirty tracking機能を使う
  - 各エンティティにFieldのenumを定義（例: `User.Field { EMAIL, PASSWORD }`）
  - 状態変更メソッドで `addChangedField(Field.XXX)` を呼ぶ

### infrastructure層
- Repository命名規則
  - 取得: `findByXxx`
  - 挿入: `insert`
  - 更新: `update`
  - 削除: `deleteById`
- `insert`は挿入後のエンティティを返す
- `update`は`void`、影響行数0なら例外をスロー
- dirty trackingで変更フィールドのみUPDATE
  - `Map<Entity.Field, BiConsumer<Entity, Record>>` でフィールドマッピング

### sharedモジュール
- `shared/public/` 配下のクラスは全featureモジュールから参照可能

### エラーハンドリング
- 各層で専用の例外クラスを使用する
  - Application層: `ApplicationLayerException` → 400
  - Domain層: `DomainLayerException` → 400
  - Infrastructure層: `InfraLayerException` → 500
- `IllegalArgumentException`は使用しない（層が不明確になる）
- Domain層のValueObjectバリデーションは`DomainLayerException`を使用
- RestApiでtry-catchしない（GlobalExceptionHandlerに任せる）
- GlobalExceptionHandlerが全例外を処理
  - `MethodArgumentNotValidException`（Spring @Valid） → 400
  - `ApplicationLayerException` → 400（メッセージをレスポンスに含める）
  - `DomainLayerException` → 400（メッセージをレスポンスに含める）
  - `InfraLayerException` → 500（ログ出力）
  - `Exception` → 500（ログ出力）

## test
- カバレッジ90%以上
- testメソッド名は日本語でテストの意図が明確な名前にすること
- given when thenのコメントを挿入してフェーズを見やすくすること
- 1 API = 1 テストファイルのため、メソッド名にAPI名のプレフィックスは不要
  - ○ `正しい認証情報でOKレスポンスを返す`
  - × `サインイン時_正しい認証情報でOKレスポンスを返す`
- テストデータ作成には `testsupport/databuilder/` のビルダーを使用
  - `aUser().save()` - デフォルト値で保存
  - `aUser().email("x@example.com").save()` - 値を上書きして保存
  - ビルダーは `@Autowired` でDIし、static import `aUser()` で使用
- Api in-out Test
  - Query
    - Given: 関連データ 0reset, TestBuilderでデータ準備
    - When: call api
    - Then: assert all response
  - Command
    - Given: 関連データ 0reset, TestBuilderでデータ準備
    - When: call api
    - Then: assert response & db change