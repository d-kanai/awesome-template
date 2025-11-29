# Frontend Web コーディング規約

AIができる限り漏れずに遵守するために、箇条書きでシンプルな形で管理すること。

[重要]web frontendのコーディングは以下を遵守すること

### common

- URLはハードコードでなくROUTES定数で管理すること
- **ID管理は`ids.ts`で一元管理すること**
  - 各featureモジュールに`ids.ts`を配置（例: `features/auth/ids.ts`）
  - **Button IDs（クリックイベントログ用）を先頭に、Test IDs（非ボタン要素用）を後に配置**
  - Button ID値は`-button`サフィックスを付けること（ログでボタンクリックと識別するため）
  - 例:
    ```typescript
    // Button IDs (for click event logging)
    export const SigninButtonIds = {
      submit: "auth-signin-submit-button",
    } as const;

    // Test IDs (for non-button elements)
    export const SigninTestIds = {
      emailInput: "signin-email",
      passwordInput: "signin-password",
    } as const;
    ```
- **Button/ButtonDangerコンポーネントは`id`プロパティが必須**
  - クリックイベントログ（`sendClickEvent`）に使用される
  - ButtonGroup使用時も各ボタンに`id`を指定すること
- 論理的凝集でなく、機能的凝集を優先すること（カプセル化）
  - 技術的分類（「定数である」「ユーティリティである」）でなく、ビジネス機能・ドメイン・責務（「Cookie管理」「認証」）で分類する
  - 例：Cookie定数とCookie操作を同じCookieManagerクラスに持つ。定数だけを集めたファイルには持たせない
  - 例：ルーティング定数は各機能モジュールごとに分割する（AUTH_ROUTES、USER_ROUTES）。複数モジュールのルートを1つのファイルにまとめない
- **日時取得には必ず`getNow()`を使用すること**
- **prodにログを残す場合は`console.log`は禁止。ログは必ず`logger`経由で行うこと**
- **環境変数は`process.env`を直接参照せず、必ず`features/shared/lib/env.ts`経由で取得すること**
  - 型安全性とバリデーションが保証される
  - 全ての環境変数は必須（デフォルト値なし）。設定漏れがあると起動時にエラーになる
- **エラーハンドリングとログ出力**
  - エラーをcatchした場合、必ずログ出力するか、呼び出し元にエラーを伝播すること
  - 意図的にエラーを握りつぶす場合（例: Client-side環境での正常動作、フォールバック処理）は、必ずコメントで理由を明記すること
  - **Server ActionおよびQueryでのエラーログ出力は不要**
    - APIエラーは既にfetcher層で自動的にログ記録される（requestId, userId, sessionId, stack trace含む）
    - Server ActionおよびQueryのcatchブロックではログを出さず、エラー処理のみを行うこと

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
- **マルチステップフロー制御**: [`flow_control.md`](./flow_control.md)を参照すること
- **グローバル状態管理（Zustand）**
  - ページをまたぐ状態、複数コンポーネントをまたぐ状態はZustandのstoreを利用すること
  - **下の層に渡すのが面倒という理由だけで安易にstoreを使わないこと**
  - 例: マルチステップフロー、カート状態、通知状態など

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
  - **Zustand Storeを使用する画面のテスト**
    - beforeEach で `useFlowStore.getState().reset()` を呼び出してストアをリセットすること
    - Then: **ストアの状態変化を検証すること**
- **data-testid の使い方**
  - elementを特定する際はdata-testid属性を利用し、ハードコードでなく`ids.ts`の定数を参照すること
  - ボタン要素は`ButtonIds`を、非ボタン要素は`TestIds`を使用すること
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
- elementを特定する際はdata-testid属性を利用し、ハードコードでなく`ids.ts`の定数を参照すること