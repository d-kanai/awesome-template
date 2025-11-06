# Frontend Web コーディング規約

[重要]web frontendのコーディングは以下を遵守すること

### code

- feature baseのディレクトリ構造にすること
- 基本的にRSC・Server Actionを利用すること
  - ※ ClientSideのFormValidationも実装するため、Tanstack Form x Server Actionの組み合わせにすること（useActionStateは利用しない）
  - ※ Tanstack Formとのコンビネーションが弱いため、ServerAction内でのnavigationは利用せず、client side navigationにすること
- page.tsxはRSC + Screen Component renderのみにすること (基本的にRoutingのみの位置付け)
- URLはハードコードでなくROUTES定数で管理すること
- backendへのリクエストはOpenAPI定義からOrvalで生成したClientFunctionを使うこと
- client side form validationはzod schemaを利用すること
- server action form validtion

### UT spec

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
        - ※ Tanstack Formとの組み合わせのためにServerSide Navigationしないルールなので、結果としてServerActionも統合したテストが動作する
      - Client Side URL遷移が起きていること
      - Toastなど、ユーザへのFBが起きていること

### E2E spec
