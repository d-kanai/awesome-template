# 🎭 E2E実装ワークフロー

## 📋 概要

Gherkin → Playwright E2Eテストの実装フロー。

```
📝 Feature確認 → 🔍 MCP探索 → ⚙️ Step実装 → 🧪 テスト → 🐛 デバッグ
```

## 🔄 実装フロー

### 1️⃣ Playwright MCPで探索

```javascript
// ページ構造確認
playwright_navigate({ url: 'http://localhost:3000/auth/signup' })
playwright_get_visible_html({ removeScripts: true })

// 操作テスト
playwright_fill({ selector: '[data-testid="signup-email"]', value: 'test@example.com' })
playwright_screenshot({ name: 'after-input' })
```

### 2️⃣ ステップ定義実装

```typescript
import { AUTH_ROUTES } from "../../features/auth/routes";
import { SignupTestIds } from "../../features/auth/ids";

Given("サインアップページにアクセス", async function() {
  await this.page.goto(AUTH_ROUTES.SIGNUP);
});

When("メールアドレスに {string} を入力", async function(email: string) {
  await this.page.getByTestId(SignupTestIds.emailInput).fill(email);
});
```

## 📏 ルール

| ✅ 正しい | ❌ 避ける |
|----------|----------|
| `AUTH_ROUTES.SIGNUP` | `'/auth/signup'` |
| `getByTestId(TestIds.xxx)` | `locator('input[type="email"]')` |
| ページごとに明確なステップ | 条件分岐で複数ページ対応 |

## 🐛 デバッグフロー

```javascript
// 1. 状態確認
playwright_screenshot({ name: 'error-state', fullPage: true })
playwright_get_visible_html({ maxLength: 10000 })

// 2. ログ確認
playwright_console_logs({ type: 'error', limit: 50 })

// 3. 要素確認
playwright_evaluate({ script: `document.querySelector('[data-testid="xxx"]')` })
```

## ✅ タスク管理

E2E実装は必ずTodoWriteで進捗可視化:

```
1. ✅ Featureファイル確認
2. 🔄 MCP探索中
3. ⏸️ ステップ定義実装
4. ⏸️ テスト実行
5. ⏸️ デバッグ
```
