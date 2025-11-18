# 🎭 E2E実装ワークフロー

## 📋 概要

このドキュメントは、Gherkin featureファイルからPlaywright E2Eテストのステップ定義を実装する際のワークフローを定義します。

## 🔄 実装フロー

### 1. 📝 Featureファイルの確認

```gherkin
# e2e/features/auth.feature
Scenario: 新規ユーザーのサインアップ
  Given サインアップページにアクセス
  When メールアドレスに "newuser@example.com" を入力
  And パスワードに "password123" を入力
  And サインアップボタンをクリック
  Then サインインページに遷移
```

### 2. 🔍 Playwright MCPを使った探索フェーズ

**ステップ定義を書く前に、Playwright MCPで実際にページを操作して情報収集する。**

#### 2.1 🌐 ページに移動して構造を確認

```javascript
// 1. ページに移動
playwright_navigate({
  url: 'http://localhost:3000/auth/signup',
  headless: false  // 目視確認したい場合
})

// 2. ページのHTMLを取得してdata-testidを確認
playwright_get_visible_html({
  removeScripts: true,
  maxLength: 10000
})

// 3. 表示テキストを確認
playwright_get_visible_text()
```

#### 2.2 ⚡ 要素の操作可能性を確認

```javascript
// 実際に入力してみる
playwright_fill({
  selector: '[data-testid="signup-email-input"]',
  value: 'test@example.com'
})

// スクリーンショットで確認
playwright_screenshot({
  name: 'after-email-input',
  fullPage: true,
  storeBase64: true
})

// ボタンをクリックしてみる
playwright_click({
  selector: '[data-testid="signup-submit-button"]'
})

// クリック後の状態を確認
playwright_screenshot({ name: 'after-submit' })
playwright_console_logs({ type: 'all', limit: 20 })
```

#### 2.3 🗺️ ルーティングの確認

```javascript
// URLは必ずroutes.tsに定義されたものを使用
// features/auth/routes.ts などを確認
```

### 3. ⚙️ ステップ定義の実装

探索フェーズで得た情報を元に、ステップ定義を実装する。

```typescript
// e2e/steps/auth.steps.ts
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { AUTH_ROUTES } from "../../features/auth/routes";
import { SignupTestIds } from "../../features/auth/test-ids";
import type { CustomWorld } from "./world";

Given("サインアップページにアクセス", async function (this: CustomWorld) {
  await this.page.goto(AUTH_ROUTES.SIGNUP);
});

When(
  "メールアドレスに {string} を入力",
  async function (this: CustomWorld, email: string) {
    await this.page.getByTestId(SignupTestIds.emailInput).fill(email);
  }
);
```

### 4. 🐛 エラー発生時のデバッグフロー

テストが失敗した場合、以下の順序で情報収集する：

#### 4.1 📸 基本情報の収集

```javascript
// 1. スクリーンショット撮影
playwright_screenshot({
  name: 'error-state',
  fullPage: true,
  storeBase64: true
})

// 2. 現在のHTMLを取得
playwright_get_visible_html({
  removeScripts: true,
  maxLength: 10000
})

// 3. 表示テキストを確認
playwright_get_visible_text()
```

#### 4.2 📋 ログの確認

```javascript
// 4. コンソールログ（エラーのみ）
playwright_console_logs({
  type: 'error',
  limit: 50
})

// 5. コンソールログ（全て）
playwright_console_logs({
  type: 'all',
  limit: 50
})
```

#### 4.3 🔎 要素の存在確認

```javascript
// 6. 特定の要素が存在するか確認
playwright_evaluate({
  script: `
    const element = document.querySelector('[data-testid="expected-element"]');
    console.log('Element found:', !!element);
    console.log('Element HTML:', element?.outerHTML);
    element;
  `
})
```

#### 4.4 🌐 ネットワークの確認

```javascript
// 7. ネットワークリクエスト/レスポンスの監視
playwright_expect_response({
  id: 'signup-request',
  url: '/auth/signup'
})

// アクションを実行

playwright_assert_response({
  id: 'signup-request',
  value: 'expected response body'
})
```

### 5. 📏 実装のルール

#### 5.1 🔗 URLの管理

```typescript
// ❌ NG: ハードコード
await this.page.goto('http://localhost:3000/auth/signup');

// ✅ OK: routes.tsを使用
import { AUTH_ROUTES } from "../../features/auth/routes";
await this.page.goto(AUTH_ROUTES.SIGNUP);
```

#### 5.2 🏷️ Test IDの使用

```typescript
// ❌ NG: CSSセレクタの直接指定
await this.page.locator('input[type="email"]').fill(email);

// ✅ OK: test-idsを使用
import { SignupTestIds } from "../../features/auth/test-ids";
await this.page.getByTestId(SignupTestIds.emailInput).fill(email);
```

#### 5.3 🎯 ステップ定義の粒度

**条件分岐は極力避ける。ステップは具体的に定義する。**

```typescript
// ❌ NG: 条件分岐で複数のページに対応
When(
  "メールアドレスに {string} を入力",
  async function (this: CustomWorld, email: string) {
    const currentUrl = this.page.url();
    if (currentUrl.includes(AUTH_ROUTES.SIGNIN)) {
      await this.page.getByTestId(SigninTestIds.emailInput).fill(email);
    } else if (currentUrl.includes(AUTH_ROUTES.SIGNUP)) {
      await this.page.getByTestId(SignupTestIds.emailInput).fill(email);
    }
  }
);

// ✅ OK: ページごとに明確なステップを定義
When(
  "サインインページのメールアドレスに {string} を入力",
  async function (this: CustomWorld, email: string) {
    await this.page.getByTestId(SigninTestIds.emailInput).fill(email);
  }
);

When(
  "サインアップページのメールアドレスに {string} を入力",
  async function (this: CustomWorld, email: string) {
    await this.page.getByTestId(SignupTestIds.emailInput).fill(email);
  }
);
```

**理由:**
- 条件分岐はステップの責務を曖昧にする
- テストの可読性が下がる
- 予期しない動作を引き起こしやすい
- ステップ定義が何をするか一目で分かるべき

#### 5.4 ✅ タスクリストと進捗の可視化

**E2E実装作業は必ずタスクリストを使って進捗を可視化すること。**

```typescript
// ❌ NG: タスクリストなしで黙々と作業
// - ユーザーが進捗を把握できない
// - どのステップで詰まっているか分からない
// - 作業の全体像が見えない

// ✅ OK: TodoWriteツールでタスクを管理
TodoWrite({
  todos: [
    { content: "Featureファイルを確認", activeForm: "Featureファイルを確認中", status: "completed" },
    { content: "Playwright MCPでページ構造を探索", activeForm: "Playwright MCPでページ構造を探索中", status: "in_progress" },
    { content: "認証関連のステップ定義を実装", activeForm: "認証関連のステップ定義を実装中", status: "pending" },
    { content: "ユーザー一覧のステップ定義を実装", activeForm: "ユーザー一覧のステップ定義を実装中", status: "pending" },
    { content: "E2Eテストを実行して確認", activeForm: "E2Eテストを実行して確認中", status: "pending" },
  ]
})
```

**ルール:**
- 🚀 作業開始時に全体のタスクリストを作成する
- ⏳ 各タスクの開始時に`status: "in_progress"`に更新
- ✅ 各タスクの完了時に`status: "completed"`に更新
- 🆘 エラー発生時は新しいタスクを追加（例: "スクリーンショットでエラー原因を調査"）
- 👀 ユーザーが常に進捗を把握できるようにする

**例: E2E実装の典型的なタスクリスト**

```
1. ✅ [completed] Featureファイルを確認
2. ✅ [completed] 必要なroutes.tsとtest-ids.tsを確認
3. 🔄 [in_progress] Playwright MCPでサインアップページを探索
4. ⏸️ [pending] サインアップページのステップ定義を実装
5. ⏸️ [pending] サインインページのステップ定義を実装
6. ⏸️ [pending] ユーザー一覧ページのステップ定義を実装
7. ⏸️ [pending] E2Eテスト実行
8. ⏸️ [pending] エラーがあればデバッグ
```

## 🗺️ ワークフローまとめ

```
1. 📝 Featureファイル確認 + ✅ タスクリスト作成
   ↓
2. 🔍 Playwright MCPで探索（進捗を更新しながら）
   - 🌐 navigate してページ表示
   - 📄 get_visible_html で構造確認
   - ⚡ fill/click で操作確認
   - 📸 screenshot で視覚確認
   ↓
3. ⚙️ ステップ定義実装（進捗を更新しながら）
   - 🔗 routes.ts からURL取得
   - 🏷️ test-ids.ts から TestID取得
   ↓
4. 🧪 テスト実行（進捗を更新しながら）
   ↓
5. 🐛 エラー時のデバッグ（新しいタスクを追加しながら）
   - 📸 screenshot（視覚確認）
   - 📄 get_visible_html（構造確認）
   - 📝 get_visible_text（テキスト確認）
   - 📋 console_logs（エラー確認）
   - 🌐 expect_response/assert_response（ネットワーク確認）
   ↓
6. 🔄 修正して再実行（進捗を更新しながら）
```

## 🎁 Playwright MCP活用のメリット

- 👁️ **コードを読まずに実際の動作を確認できる**
- 🎯 **推測ではなく確実な情報に基づいて実装できる**
- 🖼️ **視覚的な確認でCSSやタイミングの問題を発見しやすい**
- ⚡ **デバッグが高速化する**

## 📚 参考

- Playwright MCP Server: `@executeautomation/playwright-mcp-server`
- コーディング規約: `/frontend_web/doc/code_rule.md`
- 開発ワークフロー: `/doc/development_workflow.md`
