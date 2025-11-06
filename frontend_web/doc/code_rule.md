# Frontend Web コーディング規約

[重要]web frontendのコーディングは以下を遵守すること

### code

- feature baseのディレクトリ構造にすること
- コンポーネントは、export関数のreturn部分を見ただけでUIの構造が理解できるよう、ファイル内の内部コンポーネントに分割すること
  - 例: `<form><EmailField /><PasswordField /><SubmitButton /></form>` のような構造が一目でわかるように
  - 詳細な実装は内部コンポーネント定義に記述し、メインのreturn部分はUIの構造を表現することに専念すること
- 基本的にRSC・Server Actionを利用すること
  - ※ ClientSideのFormValidationも実装するため、react-hook-form x Server Actionの組み合わせにすること（useActionStateは利用しない）
  - ※ エラーハンドリングとフォーム状態管理を柔軟に行うため、ServerAction内でのnavigation(redirect)は利用せず、client side navigationにすること
- page.tsxはRSC + Screen Component renderのみにすること (基本的にRoutingのみの位置付け)
- URLはハードコードでなくROUTES定数で管理すること
- backendへのリクエストはOpenAPI定義からOrvalで生成したClientFunctionを使うこと
- form validationはzodを利用し、client side, server action共通の定義(schemas.ts)を利用すること
- form周りの情報(key名など)はzodのschema定義からできる限り取得し、SSOFとすること
- 不要なobject destructureを利用しないこと（無駄にtmp変数を増やさないこと）

### UT spec

- describe()で正常系・異常系を分割すること
- it()のケース名は日本語でテストの意図が明確な名前にすること
  - 例: `describe("正常系") > it("サインイン画面に遷移する", ...)`
- テストコード内部にはgiven when thenのコメントを日本語で挿入してフェーズを見やすくすること
- TestC: Screen Level Test (RSC, Server Action統合テスト)
  - Common
    - given when thenのコメントを日本語挿入してフェーズを見やすくすること
    - Screenから呼び出しているComponent全てのカバレッジが90%以上になるように、eventを網羅するようにすること
  - Query
    - Given: Query APIレスポンスモック
    - When: QueryするRSC実行 => Screen ComponentにRSCのdataをpropsで渡して実行
      - ※ spec上でRSCとScreenをpage.tsxのように統合してテストする
    - Then: 画面にAPIデータが表示されていること
  - Command
    - Given: -
    - When: page render
    - Then: 
      - Server Action内のCommand APIにformのパラメータが渡り呼び出されていること
        - ※ エラーハンドリングを柔軟にするためにServer Side Navigation(redirect)しないルールなので、結果としてServerActionも統合したテストが動作する
      - Client Side URL遷移が起きていること
      - Toastなど、ユーザへのFBが起きていること
- 全てのScreenにTestCが作成されていること

### E2E spec
