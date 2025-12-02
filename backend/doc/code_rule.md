[重要]backendのコーディングは以下を遵守すること

## common

- 基本全ての変数にfinalがついていること
- メソッド30行以内
- ローカル変数・パラメータは基本final宣言
- 認知・循環複雑度15以内
- deep nest 2以内

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

### domain層
- フィールドは全てfinal（イミュータブル）
- setterは使用禁止
- updateXxx ではなく、ビジネス上の振る舞いの言葉を使う（例: `changePassword`, `activate`, `cancel`）
- コンストラクタはprivate、static factoryメソッドで生成
- 完全コンストラクタパターン（コンストラクタ内でバリデーションを行い、不正なインスタンスを生成させない）

### infrastructure層
- (TODO)

### sharedモジュール
- `shared/public/` 配下のクラスは全featureモジュールから参照可能
- 現在時刻の取得は必ず `AppClock` を使用すること（`Instant.now()`, `LocalDateTime.now()` 等の直接呼び出し禁止）
- ログ出力は必ず `AppLogger` を経由すること（`LoggerFactory.getLogger()` の直接使用禁止）

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