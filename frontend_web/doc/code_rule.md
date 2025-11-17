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
- **日時取得には必ず`getNow()`を使用すること**
  - `new Date()`を直接使用しないこと（テストでモック可能にするため）
  - 使用例：`import { getNow } from "@/features/shared/lib/dateTime"`
  - タイムスタンプ生成には`getJSTTimestamp()`を使用すること（JST形式のISO 8601文字列を返す）
- **`console.log`は禁止。ログは必ず`logger`経由で行うこと**
  - `console.log`を使用するとLintエラーになる（Biomeの`noConsoleLog`ルール）
  - Production環境にログを残す場合は`features/shared/lib/logger.ts`の`logAccess()`または`logApiRequest()`を使用すること
  - 許可される例外:
    - `features/shared/lib/logger.ts`内（実際のログ出力実装）
    - `e2e/**/*`内（E2Eテストのデバッグ用）
  - デバッグ時も`console.log`は使わず、削除すること

### code

- feature baseのディレクトリ構造にすること (feature間の依存関係をわかりやすくすること)
- コンポーネントは、export関数のreturn部分を見ただけでUIの構造が理解できるよう、ファイル内の内部コンポーネントに分割すること
  - 例: `<form><EmailField /><PasswordField /><SubmitButton /></form>` のような構造が一目でわかるように
  - 詳細な実装は内部コンポーネント定義に記述し、メインのreturn部分はUIの構造を表現することに専念すること
- 基本的にRSC・Server Actionを利用すること
  - ※ ClientSideのFormValidationも実装するため、react-hook-form x Server Actionの組み合わせにすること（useActionStateは利用しない）
  - ※ エラーハンドリングとフォーム状態管理を柔軟に行うため、ServerAction内でのnavigation(redirect)は利用せず、client side navigationにすること
- page.tsxはRSC + Screen Component renderのみにすること (基本的にRoutingのみの位置付け)
  - app routerのpageは、データ取得(RSC)を行い、すぐにfeatures配下のScreen componentを呼び出すだけにすること
  - 例: `app/home/page.tsx` → `features/home/screens/HomeScreen.tsx`を呼び出す
- backendへのリクエストはOpenAPI定義からOrvalで生成したClientFunctionを使うこと
- form validationはzodを利用し、client side, server action共通の定義(schemas.ts)を利用すること
- form周りの情報(key名など)はzodのschema定義からできる限り取得し、SSOFとすること
- 不要なobject destructureを利用しないこと（無駄にtmp変数を増やさないこと）
- queries/とactions/でサーバーサイド処理を分類すること
  - queries/: データ取得(読み込み専用)の処理。React.cacheでラップすること
    - 例: `features/auth/queries/getSession.ts`, `features/home/queries/getTestimonials.ts`
  - actions/: データ変更(mutations/commands)のServer Actions
    - 例: `features/auth/actions/signin.ts`, `features/auth/actions/signout.ts`

### css

- shadcn/ui方式（CSS変数）でテーマ管理
- カラー: セマンティック名を優先（`bg-primary`, `text-foreground`, `border-border`） - ダークモード自動対応
- スペーシング・タイポグラフィ: Figmaトークンを使用（`Space-*`, `Scale-*`）
- ハードコード値は使用しない

### Figma component integration

Figmaコンポーネントの取り込みについては、レベルに応じて別ドキュメントを参照すること。

- **Component Level** (Atoms / Molecules / Organisms): [`figma_import_component.md`](./figma_import_component.md)
  - Figma Desktop MCPツールの使用方法
  - Atomic Designに基づく段階的実装手順
  - forwardRefパターン、デザイントークン使用
  - Figma更新時の差分同期

- **Page Level** (Pages / Templates): [`figma_import_page.md`](./figma_import_page.md)
  - API統合ワークフロー（バックエンド実装前でも完成）
  - Screen Tests作成ルール
  - モックモード（`api_mock_mode/`）の使用

### UT spec

- describe()で正常系・異常系を分割すること
- it()のケース名は日本語でテストの意図が明確な名前にすること
  - 例: `describe("正常系") > it("サインイン画面に遷移する", ...)`
- テストコード内部にはgiven when thenのコメントを日本語を体言止めで挿入してフェーズを見やすくすること
- **ただの静的表示を確認するだけのテストは書かないこと**
  - 例: 「ページコンテナが表示される」「ヘッダーが表示される」など、UIが単に存在することを確認するだけのテストは不要
  - 理由: これらは実装の詳細であり、ユーザーにとって価値のある振る舞いをテストすべき
  - 代わりに: APIデータが表示される、ユーザーアクションに反応する、など意味のある振る舞いをテストすること
- Screen Level Test (RSC, Server Action統合テスト)
  - Common
    - 全てのScreenにTestが作成されていること
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
- **data-testid の使い方**
  - elementを特定する際はdata-test-id属性を利用し、ハードコードはなく、実装と同じ定数参照をすること
  - **共有コンポーネント（features/shared/ui/components/）に無理やり data-testid プロパティを追加しないこと**
    - 理由: 特定のページテストのためだけに共有コンポーネントのインターフェースを変更すると、コンポーネントが複雑化し保守性が下がる
    - もし wrapper が必要な場合は、Fragment (`<>`) など UI に影響しないタグを使うこと（`div` を使わない）
    - ページ固有のテストIDは、Screen Component 内で付与すること
- **余計なラッパー要素を追加しないこと**
  - 共有コンポーネントが既に適切なセマンティック要素（`<section>`, `<article>`, `<header>`など）で実装されている場合、さらに同じ要素で囲まないこと
  - テストのためだけに`<div>`や`<section>`で囲むことは避けること
  - 必要な場合はFragment (`<>`) を使うか、実際の要素（テキスト、ボタンなど）でアサーションすること

### E2E spec (playwright)

.feature file
- Scenario/Given/When/Thenのステップ定義を全て体言止めにする
  - 例: "サインアップページにアクセスする" → "サインアップページにアクセス"

step definition file
- signinする場合はbypassSigninを基本利用し、高速にすること
- elementを特定する際はdata-test-id属性を利用し、ハードコードはなく、実装と同じ定数参照をすること