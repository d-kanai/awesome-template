# Frontend Web コーディング規約

このドキュメントは、frontend_web プロジェクトのコーディング規約を定義します。

## 目次

- [プロジェクト概要](#プロジェクト概要)
- [ディレクトリ構造](#ディレクトリ構造)
- [コーディング規約](#コーディング規約)
- [テスト](#テスト)
- [スタイリング](#スタイリング)

## プロジェクト概要

### 技術スタック

- **フレームワーク**: Next.js 15.1.4 (App Router)
- **言語**: TypeScript 5.9.2
- **UI ライブラリ**: React 19.1.0
- **状態管理**: TanStack Query 5.90.5
- **フォーム**: TanStack Form 1.23.8 + Zod 3.25.76
- **スタイリング**: Tailwind CSS 3.4.17
- **API クライアント**: Orval 7.1.1
- **機能フラグ**: Unleash 5.0.1
- **テスト**: Vitest 2.1.8, Playwright 1.49.1, Cucumber 11.1.0
- **コード品質**: Biome 1.9.4, Knip 5.66.4

## ディレクトリ構造

```
frontend_web/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # ルートレイアウト
│   ├── page.tsx                 # ホームページ
│   ├── auth/                    # 認証ページ
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   └── user/                    # ユーザーページ
│       └── page.tsx
├── features/                     # 機能ベースのディレクトリ
│   ├── auth/                    # 認証機能
│   │   ├── components/          # 認証コンポーネント
│   │   ├── hooks/               # 認証カスタムフック
│   │   ├── schemas/             # バリデーションスキーマ
│   │   └── screens/             # 認証画面コンポーネント
│   ├── user/                    # ユーザー機能
│   │   ├── components/
│   │   ├── hooks/
│   │   └── screens/
│   └── shared/                  # 共通機能
│       ├── api/                 # API関連
│       │   ├── fetcher.ts       # カスタムfetcher
│       │   └── generated/       # Orvalで生成されたコード
│       ├── components/          # カスタム共通コンポーネント
│       ├── figma_generated/     # Figma生成コンポーネント
│       ├── hooks/               # 共通カスタムフック
│       ├── lib/                 # ユーティリティ
│       └── providers/           # Reactプロバイダー
├── e2e/                         # E2Eテスト
│   ├── features/                # Gherkinフィーチャーファイル
│   ├── steps/                   # ステップ定義
│   └── support/                 # テストサポートファイル
├── public/                      # 静的ファイル
└── doc/                         # ドキュメント
```

## コーディング規約

### 一般規則

#### ファイル命名

- コンポーネント: PascalCase (`UserList.tsx`)
- フック: camelCase with `use` prefix (`useUserList.ts`)
- ユーティリティ: camelCase (`formatDate.ts`)
- 型定義: PascalCase (`User.ts`)
- テストファイル: `*.spec.tsx` (ソースファイルの隣に配置)

#### TypeScript

```typescript
// ✅ Good: 明示的な型定義
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export function getUserById(id: string): Promise<User> {
  return fetcher(`/users/${id}`);
}

// ❌ Bad: any型の使用
function getUser(id: any): any {
  return fetcher(`/users/${id}`);
}
```

- `any` 型の使用を避ける
- 関数の引数と戻り値に型を明示する
- インターフェースを優先（型エイリアスよりも）
- strict モードを有効にする

#### コンポーネント設計

```typescript
// ✅ Good: 関数コンポーネント + 型定義
interface ButtonProps {
  variant?: "primary" | "secondary";
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant = "primary", onClick, children }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant }))} onClick={onClick}>
      {children}
    </button>
  );
}

// ❌ Bad: propsの型定義なし
export function Button({ variant, onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}
```

- Server Components と Client Components を適切に使い分ける
- "use client" は必要な場合のみ使用
- 小さく再利用可能なコンポーネントを作成
- Props の型を明示的に定義

#### カスタムフック

```typescript
// ✅ Good: カスタムフック with TanStack Query
export function useUserList() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}

// ❌ Bad: useEffect で手動でデータフェッチ
export function useUserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("/users").then((res) => res.json()).then(setUsers);
  }, []);
  return users;
}
```

- `use` プレフィックスを使用
- データフェッチには TanStack Query を使用
- 複雑なロジックをコンポーネントから分離

#### API 呼び出し

```typescript
// ✅ Good: fetcher を使用
async function fetchUsers(): Promise<User[]> {
  return fetcher("/users", {
    method: "GET",
  });
}

// ❌ Bad: fetch を直接使用
async function fetchUsers() {
  const res = await fetch("http://localhost:8080/users");
  return res.json();
}
```

- `features/shared/api/fetcher.ts` を使用
- Orval で生成された API クライアントを優先
- httpOnly Cookie 認証のため `credentials: 'include'` が自動設定される

### 認証

```typescript
// ✅ Good: AuthProvider を使用
function MyComponent() {
  const { isAuthenticated, signIn, signOut } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" />;
  }

  return <div>Protected content</div>;
}

// ❌ Bad: ローカルストレージにトークンを保存
function MyComponent() {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/auth/signin" />;
  }
  return <div>Protected content</div>;
}
```

- httpOnly Cookie による認証を使用
- トークンをクライアントサイドに保存しない
- `AuthProvider` を通じて認証状態を管理

## テスト

### ユニットテスト

#### テストファイルの配置

- ソースファイルの隣に `.spec.tsx` として配置
- 例: `SignupForm.tsx` → `SignupForm.spec.tsx`

#### テストの書き方

```typescript
// ✅ Good: Given-When-Then形式 with 日本語コメント
describe("SignupForm", () => {
  it("given: SignupFormが表示される when: コンポーネントがレンダリングされる then: すべてのフィールドが表示される", () => {
    renderWithProviders(<SignupForm />);

    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByLabelText("名前")).toBeInTheDocument();
  });
});

// ❌ Bad: 説明が不十分
describe("SignupForm", () => {
  it("renders", () => {
    renderWithProviders(<SignupForm />);
    expect(screen.getByText("サインアップ")).toBeInTheDocument();
  });
});
```

- Given-When-Then 形式で記述
- 日本語でテストの意図を明確に記述
- `renderWithProviders` を使用してプロバイダーをセットアップ

#### モック

```typescript
// ✅ Good: vi.mock でモジュール全体をモック
vi.mock("@/features/shared/api/fetcher", () => ({
  fetcher: vi.fn(),
}));

// テスト内で個別にモックの振る舞いを設定
it("test", async () => {
  const { fetcher } = await import("@/features/shared/api/fetcher");
  vi.mocked(fetcher).mockResolvedValue(mockData);

  // テスト実行
});
```

- グローバルモックは `vitest.setup.ts` で定義
- テスト固有のモックはテストファイル内で定義
- `vi.mocked()` を使用して型安全性を確保

### E2Eテスト

#### Gherkin フィーチャーファイル

```gherkin
# ✅ Good: 日本語で明確なシナリオ
# language: ja
フィーチャ: 認証機能
  ユーザーがサインアップ、サインイン、サインアウトできること

  シナリオ: 新規ユーザーのサインアップ
    前提 サインアップページにアクセスする
    もし メールアドレスに "test@example.com" を入力する
    かつ パスワードに "password123" を入力する
    かつ 名前に "テストユーザー" を入力する
    かつ サインアップボタンをクリックする
    ならば サインインページに遷移する
```

- 日本語で記述
- ビジネス要件を反映
- ステップは再利用可能に

#### ステップ定義

```typescript
// ✅ Good: 明確で再利用可能なステップ
Given("サインアップページにアクセスする", async function (this: CustomWorld) {
  await this.page.goto("/auth/signup");
});

When("メールアドレスに {string} を入力する", async function (this: CustomWorld, email: string) {
  await this.page.fill('input[type="email"]', email);
});

// ❌ Bad: 詳細すぎるステップ
When("id が signup-email の input に test@example.com を入力する", async function (this: CustomWorld) {
  await this.page.fill('#signup-email', 'test@example.com');
});
```

- パラメータ化されたステップを使用
- 実装の詳細を隠蔽
- Page Object パターンを検討

## スタイリング

### Tailwind CSS

```typescript
// ✅ Good: Tailwind クラスの使用
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}

// ✅ Good: CVA を使用したバリアント管理
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      },
    },
  }
);

export function Button({ variant = "primary", ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }))} {...props} />;
}
```

- Tailwind CSS クラスを使用
- `class-variance-authority` (CVA) でバリアントを管理
- `clsx` と `tailwind-merge` を組み合わせた `cn` ユーティリティを使用

### Figma 連携

```
features/shared/
├── figma_generated/     # Figma から自動生成（Git管理下）
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
└── components/          # カスタムコンポーネント
    └── FormInput.tsx
```

- `figma_generated/` はFigma Code Connectで自動生成
- このディレクトリは Git で管理される
- カスタムコンポーネントは `components/` に配置
- Figma生成コンポーネントは直接編集しない

## バリデーション

### Zod スキーマ

```typescript
// ✅ Good: 明示的なエラーメッセージ with 日本語
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .max(100, "パスワードは100文字以内で入力してください"),
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(100, "名前は100文字以内で入力してください"),
});

// ❌ Bad: デフォルトエラーメッセージ
export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
});
```

- カスタムエラーメッセージを日本語で定義
- ビジネスルールを明確に記述
- 型安全性のため `z.infer` を使用

### フォームバリデーション

```typescript
// ✅ Good: TanStack Form + Zod
export function useSignupForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    } as SignupFormData,
    onSubmit: async ({ value }) => {
      await signupMutation.mutateAsync(value);
    },
  });

  return { form, schema: signupSchema };
}

// コンポーネント内
<form.Field
  name="email"
  validators={{
    onChange: schema.shape.email,
  }}
>
  {(field) => (
    <div>
      <Input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.errors.length > 0 && (
        <p className="text-sm text-red-600">
          {String(field.state.meta.errors[0]?.message || field.state.meta.errors[0])}
        </p>
      )}
    </div>
  )}
</form.Field>
```

- TanStack Form を使用
- onChange バリデーションで即座にフィードバック
- エラーメッセージを適切に表示

## 環境変数

```typescript
// ✅ Good: 環境変数の使用
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// ❌ Bad: ハードコーディング
const API_URL = "http://localhost:8080";
```

- `NEXT_PUBLIC_` プレフィックスでクライアント側の環境変数を定義
- デフォルト値を提供
- `features/shared/lib/constants.ts` で管理

## 機能フラグ

```typescript
// ✅ Good: 定数で管理
export const FEATURE_FLAGS = {
  SHOW_VERSION_INFO: "show-version-info",
  NEW_USER_DASHBOARD: "new-user-dashboard",
} as const;

// コンポーネント内
import { useFlag } from "@unleash/proxy-client-react";

function MyComponent() {
  const isEnabled = useFlag(FEATURE_FLAGS.NEW_USER_DASHBOARD);

  if (isEnabled) {
    return <NewDashboard />;
  }
  return <OldDashboard />;
}

// ❌ Bad: マジックストリング
function MyComponent() {
  const isEnabled = useFlag("new-user-dashboard");
  // ...
}
```

- フラグ名は定数で管理
- `FEATURE_FLAGS` オブジェクトに集約
- Unleash の `useFlag` フックを使用

## Git とコミット

### コミットメッセージ

```
# ✅ Good
Add user authentication with httpOnly cookies

Implement signin/signup flows using TanStack Form and Zod validation.
Authentication state is managed via httpOnly cookies for security.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>

# ❌ Bad
fix bugs
update code
wip
```

- 簡潔で説明的なタイトル（50文字以内）
- 本文で変更の理由と内容を説明
- 関連する issue やチケット番号を含める

### ブランチ戦略

- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 新機能
- `fix/*`: バグ修正
- `refactor/*`: リファクタリング

## CI/CD

### GitHub Actions

- **frontend_web_ut.yml**: ユニットテスト、リント、型チェック
- **frontend_web_e2e.yml**: E2Eテスト

### ワークフロー

```yaml
# 自動実行条件
- main, develop ブランチへのpush
- Pull Request作成時
- frontend_web/ ディレクトリの変更時
```

## セキュリティ

### ベストプラクティス

```typescript
// ✅ Good: httpOnly Cookie 認証
const response = await fetcher("/auth/signin", {
  method: "POST",
  data: { email, password },
  // credentials: 'include' は自動設定される
});

// ❌ Bad: トークンをローカルストレージに保存
localStorage.setItem("token", response.token);
fetch("/api/users", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

- httpOnly Cookie を使用してトークンを保存
- XSS 攻撃を防ぐためトークンをクライアントに露出しない
- CSRF 対策を実装（バックエンド側）
- 環境変数に機密情報を保存しない

### 入力検証

```typescript
// ✅ Good: サーバーサイドとクライアントサイドの両方で検証
// クライアント側
const schema = z.object({
  email: z.string().email(),
});

// サーバー側でも同様のバリデーションを実装

// ❌ Bad: クライアント側のみで検証
if (email.includes("@")) {
  // submit
}
```

- クライアントとサーバーの両方でバリデーション
- Zod スキーマを使用して一貫性を保つ
- ユーザー入力を信頼しない

## パフォーマンス

### コード分割

```typescript
// ✅ Good: dynamic import
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Spinner />,
});

// ❌ Bad: すべてを静的インポート
import HeavyComponent from "./HeavyComponent";
```

- 重いコンポーネントは動的インポート
- ローディング状態を提供
- ルートベースのコード分割を活用

### 画像最適化

```typescript
// ✅ Good: Next.js Image コンポーネント
import Image from "next/image";

<Image
  src="/logo.png"
  width={200}
  height={100}
  alt="Logo"
/>

// ❌ Bad: 通常の img タグ
<img src="/logo.png" alt="Logo" />
```

## アクセシビリティ

```typescript
// ✅ Good: セマンティックHTML + ARIA
<button
  aria-label="メニューを開く"
  aria-expanded={isOpen}
>
  <MenuIcon />
</button>

// ❌ Bad: 意味のないdiv
<div onClick={handleClick}>
  <MenuIcon />
</div>
```

- セマンティック HTML を使用
- ARIA 属性を適切に設定
- キーボードナビゲーションをサポート
- フォームフィールドにラベルを付ける

## まとめ

このコーディング規約は、チーム全体で一貫性のある高品質なコードを維持するための指針です。
新しいベストプラクティスや技術の変更に応じて、このドキュメントも更新していきます。

質問や提案がある場合は、チームで議論してこのドキュメントを改善していきましょう。
