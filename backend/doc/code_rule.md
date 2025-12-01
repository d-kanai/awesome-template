[重要]backendのコーディングは以下を遵守すること

### common

- 基本全ての変数にfinalがついていること

### code

- application層のcommand, queryは1 class 1 public メソッドであること
  - Command/Query は必ず Output record クラスを持つこと
  - Output の field に Domain Model を含めてよい（プリミティブへの変換は不要）
  - HTTP レスポンス形式への変換は Presentation 層で行う
- presentation層の構成
  - `presentation/rest`: REST API（XxxRestApi）
  - `presentation/job`: バッチ処理・スケジュールタスク（XxxJob）
- presentation/rest は 1 class 1 API 1 public メソッドであること
  - クラス名 = ユースケース名 + RestApi（例: SignupRestApi, SigninRestApi, FindMeRestApi）
  - CRUDを1つのクラスにまとめない
  - Output.from() メソッドは Command/Query の Output を引数に取ること
- 命名規則
  - 取得系: Find〜 (例: FindMe, FindAllUsers, FindUserById)
  - 更新/作成/削除系: ビジネス上の振る舞い名を使う（例: Signup, Signin, PublishArticle, CancelOrder）
  - CRUD名（Create, Update, Delete）は避ける

### test
- testメソッド名は日本語でテストの意図が明確な名前にすること
- given when thenのコメントを挿入してフェーズを見やすくすること
