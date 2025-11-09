# Frontend Web コーディング規約

AIができる限り漏れずに遵守するために、箇条書きでシンプルな形で管理すること。

[重要]web frontendのコーディングは以下を遵守すること

### common

- URLはハードコードでなくROUTES定数で管理すること
- 基本メソッドコメントは不要
- 論理的凝集でなく、機能的凝集を優先すること（カプセル化）
  - 技術的分類（「定数である」「ユーティリティである」）でなく、ビジネス機能・ドメイン・責務（「Cookie管理」「認証」）で分類する
  - 例：Cookie定数とCookie操作を同じCookieManagerクラスに持つ。定数だけを集めたファイルには持たせない
  - 例：ルーティング定数は各機能モジュールごとに分割する（AUTH_ROUTES、USER_ROUTES）。複数モジュールのルートを1つのファイルにまとめない

### code

- feature baseのディレクトリ構造にすること (feature間の依存関係をわかりやすくすること)
- コンポーネントは、export関数のreturn部分を見ただけでUIの構造が理解できるよう、ファイル内の内部コンポーネントに分割すること
  - 例: `<form><EmailField /><PasswordField /><SubmitButton /></form>` のような構造が一目でわかるように
  - 詳細な実装は内部コンポーネント定義に記述し、メインのreturn部分はUIの構造を表現することに専念すること
- 基本的にRSC・Server Actionを利用すること
  - ※ ClientSideのFormValidationも実装するため、react-hook-form x Server Actionの組み合わせにすること（useActionStateは利用しない）
  - ※ エラーハンドリングとフォーム状態管理を柔軟に行うため、ServerAction内でのnavigation(redirect)は利用せず、client side navigationにすること
- page.tsxはRSC + Screen Component renderのみにすること (基本的にRoutingのみの位置付け)
- backendへのリクエストはOpenAPI定義からOrvalで生成したClientFunctionを使うこと
- form validationはzodを利用し、client side, server action共通の定義(schemas.ts)を利用すること
- form周りの情報(key名など)はzodのschema定義からできる限り取得し、SSOFとすること
- 不要なobject destructureを利用しないこと（無駄にtmp変数を増やさないこと）

### css

- shadcn/ui方式（CSS変数）でテーマ管理
- カラー: セマンティック名を優先（`bg-primary`, `text-foreground`, `border-border`） - ダークモード自動対応
- スペーシング・タイポグラフィ: Figmaトークンを使用（`Space-*`, `Scale-*`）
- ハードコード値は使用しない

### Figma component integration

#### コンポーネント実装の手順

1. **コンポーネントをFigmaで検索**: 実装するコンポーネント名でFigmaを検索し、個別のコンポーネントノードを見つけること
   - 推奨: Task subagentを使ってFigma内を検索する
   - 例: Avatarコンポーネントを実装する場合、"Avatar"で検索してnode IDを特定
2. **個別ノードのデザインコンテキストを取得**: 見つけたコンポーネントのnode IDで`get_design_context`を呼び出すこと
   - 理由: 個別コンポーネントとして定義されている場合、すべてのvariantやpropsが正確に取得できる
3. **ページ全体からの抽出は最終手段**: コンポーネントが個別に定義されていない場合のみ、ページ全体のデザインコンテキストから該当部分を抽出すること
   - 例: HeaderやFooterがページレイアウトの一部としてのみ存在する場合

#### デザイントークンの使用

- Figmaからコンポーネントを実装する際は、必ずFigmaのsemantic tokensを使用すること
- Tailwindのユーティリティクラス（`gap-2`, `px-3`, `rounded-lg`など）ではなく、Figma design tokensを使用すること
  - 例: `gap-2` → `gap-[var(--sds-size-space-200,8px)]`
  - 例: `px-3 py-3` → `p-[var(--sds-size-space-300,12px)]`
  - 例: `rounded-lg` → `rounded-[var(--sds-size-radius-200,8px)]`
  - 例: `border` → `border-[var(--sds-size-stroke-border,1px)]`
  - 例: `text-base font-normal` → `font-[family-name:var(--sds-typography-body-font-family)] font-[var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]`
- **重要**: Tailwind arbitrary valuesでは、プロパティの種類を明示的に指定すること
  - border-widthの場合: `border-[length:var(--sds-size-stroke-border,1px)]`
  - border-colorの場合: `border-[color:var(--sds-color-border-default-default,#d9d9d9)]`
  - text-colorの場合: `text-[color:var(--sds-color-text-default-default,#1e1e1e)]`
  - font-sizeの場合: `text-[length:var(--sds-typography-body-size-medium,16px)]`
  - 理由: Tailwindは`border-[var(...)]`を自動的に`border-color`として解釈するため、border-widthやfont-sizeなど他のプロパティには明示的な型指定が必要
- 理由: Figmaでデザイントークンの値が変更された際、CSS変数を更新するだけで全コンポーネントに反映される（コンポーネントコードの変更不要）
- MCPの`get_design_context`で取得したコードを参考に、正確なtoken名を使用すること

### UT spec

- describe()で正常系・異常系を分割すること
- it()のケース名は日本語でテストの意図が明確な名前にすること
  - 例: `describe("正常系") > it("サインイン画面に遷移する", ...)`
- テストコード内部にはgiven when thenのコメントを日本語を体言止めで挿入してフェーズを見やすくすること
- TestC: Screen Level Test (RSC, Server Action統合テスト)
  - Common
    - 全てのScreenにTestCが作成されていること
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
      - Server ActionからbackendへのCommand APIにformのパラメータが渡り呼び出されていること
        - ※ エラーハンドリングを柔軟にするためにServer Side Navigation(redirect)しないルールなので、結果としてServerActionも統合したテストが動作する
      - Client Side URL遷移が起きていること
      - Toastなど、ユーザへのFBが起きていること
- elementを特定する際はdata-test-id属性を利用し、ハードコードはなく、実装と同じ定数参照をすること

### E2E spec (playwright)

.feature file
- Scenario/Given/When/Thenのステップ定義を全て体言止めにする
  - 例: "サインアップページにアクセスする" → "サインアップページにアクセス"

step definition file
- signinする場合はbypassSigninを基本利用し、高速にすること
- elementを特定する際はdata-test-id属性を利用し、ハードコードはなく、実装と同じ定数参照をすること