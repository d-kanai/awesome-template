[重要]backendのコーディングは以下を遵守すること

### common

- 基本全ての変数にfinalがついていること

### code

- application層のcommand, queryは1 class 1 public メソッドであること
- presentation層のcontrollerは1 class 1 API 1 public メソッドであること
  - Controller名 = ユースケース名（例: SignupController, SigninController, FindMeController）
  - CRUDを1つのControllerにまとめない
- 命名規則
  - 取得系: Find〜 (例: FindMe, FindAllUsers, FindUserById)
  - 更新/作成/削除系: ビジネス上の振る舞い名を使う（例: Signup, Signin, PublishArticle, CancelOrder）
  - CRUD名（Create, Update, Delete）は避ける

### test
- testメソッド名は日本語でテストの意図が明確な名前にすること
- given when thenのコメントを挿入してフェーズを見やすくすること
