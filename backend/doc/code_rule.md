[重要]backendのコーディングは以下を遵守すること

## common

- 基本全ての変数にfinalがついていること

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
- (TODO)

### infrastructure層
- (TODO)

### 命名規則
- 取得系: Find〜 (例: FindMe, FindAllUsers, FindUserById)
- 更新/作成/削除系: ビジネス上の振る舞い名を使う（例: Signup, Signin, PublishArticle, CancelOrder）
- CRUD名（Create, Update, Delete）は避ける

## test
- testメソッド名は日本語でテストの意図が明確な名前にすること
- given when thenのコメントを挿入してフェーズを見やすくすること
- 1 API = 1 テストファイルのため、メソッド名にAPI名のプレフィックスは不要
  - ○ `正しい認証情報でOKレスポンスを返す`
  - × `サインイン時_正しい認証情報でOKレスポンスを返す`
- テストデータ作成には `testsupport/databuilder/` のビルダーを使用
  - `aUser().save()` - デフォルト値で保存
  - `aUser().email("x@example.com").save()` - 値を上書きして保存
  - ビルダーは `@Autowired` でDIし、static import `aUser()` で使用
