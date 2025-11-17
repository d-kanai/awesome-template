# フロー制御ルール

マルチステップフロー（A => B => C のような画面遷移）における直アクセス防止と順序制御の実装方針。

## 基本方針

**2段階の防御**
1. **フロントエンド**: UX改善（直アクセス時にリダイレクト）
2. **バックエンド**: セキュリティ保証（API直叩き防止）

## フロントエンド実装

### 1. React Context Providerで状態管理

```typescript
// features/[feature]/providers/FlowProvider.tsx
export function FlowProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<FlowStep>(null);
  const [formData, setFormDataState] = useState<FlowData | null>(null);

  // goToConfirm(), goToComplete(), reset() などのメソッド

  return <FlowContext.Provider value={...}>{children}</FlowContext.Provider>;
}
```

**特徴:**
- メモリ上の状態管理（Session Storage不要）
- ページリロードで自動リセット
- タブ間で共有されない

### 2. Page Level Guard

各ページ（B, C）に以下のguardを実装：

```typescript
// app/[feature]/confirm/page.tsx
export default function ConfirmPage() {
  const router = useRouter();
  const { currentStep } = useFlowContext();

  // Guard: 正しいステップでなければリダイレクト
  useEffect(() => {
    if (currentStep !== "confirm") {
      router.replace(ROUTES.INPUT);
    }
  }, [currentStep, router]);

  // レンダリング防止（リダイレクト前の一瞬の表示を防ぐ）
  if (currentStep !== "confirm") {
    return null;
  }

  return <ConfirmScreen />;
}
```

### 3. 画面遷移のフロー

```typescript
// A画面（Input）
const handleNext = async () => {
  setFormData(data);
  await startFlow();        // Server Action呼び出し
  goToConfirm();            // Context状態更新
  router.push(ROUTES.CONFIRM);
};

// B画面（Confirm）
const handleSubmit = async () => {
  const result = await completeFlow(formData);  // Server Action呼び出し
  goToComplete();           // Context状態更新
  router.push(ROUTES.COMPLETE);
};

// C画面（Complete）
useEffect(() => {
  reset();  // 状態クリア（再アクセス時はInput画面へリダイレクトされる）
}, []);
```

## バックエンド実装

### Server Action（現状: 仮実装）

```typescript
// features/[feature]/actions/startFlow.ts
export async function startFlow() {
  await info("Flow started", { ... });
  return { success: true };
}

// features/[feature]/actions/completeFlow.ts
export async function completeFlow(data: FlowData) {
  await info("Flow completion requested", { data, ... });
  return { success: true };
}
```

### 将来の本実装（Java API + Redis）

#### A画面の「次へ」ボタン

```typescript
export async function startFlow() {
  'use server'

  // Java API /flow/start を呼び出し
  await fetch('http://backend/flow/start', { method: 'POST' });
  // → Java側でRedisに flow:{userId}:state = "STEP_B_ALLOWED" を設定（TTL: 1時間）

  return { success: true };
}
```

#### B画面のSubmit

```typescript
export async function completeFlow(data: FlowData) {
  'use server'

  // Java API /flow/complete を呼び出し
  const response = await fetch('http://backend/flow/complete', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // Java側の処理:
  // 1. Redisから flow:{userId}:state をチェック
  // 2. "STEP_B_ALLOWED" でなければ400エラー
  // 3. 正常ならビジネスロジック実行 + Redis削除

  if (!response.ok) {
    return { error: "Invalid flow state" };
  }

  return { success: true };
}
```

#### Java側実装例

```java
@PostMapping("/flow/start")
public ResponseEntity<Void> startFlow() {
    String userId = getCurrentUserId();
    redisTemplate.opsForValue().set(
        "flow:" + userId + ":state",
        "STEP_B_ALLOWED",
        1, TimeUnit.HOURS
    );
    return ResponseEntity.ok().build();
}

@PostMapping("/flow/complete")
public ResponseEntity<?> completeFlow(@RequestBody FlowData data) {
    String userId = getCurrentUserId();
    String state = redisTemplate.opsForValue().get("flow:" + userId + ":state");

    if (!"STEP_B_ALLOWED".equals(state)) {
        return ResponseEntity.badRequest().body("Invalid flow state");
    }

    // ビジネスロジック実行
    processFlow(data);

    // ワンタイム処理（状態削除）
    redisTemplate.delete("flow:" + userId + ":state");

    return ResponseEntity.ok().build();
}
```

## セキュリティ

### CSRF対策

**Next.js Server Action:**
- デフォルトでCSRF保護が組み込まれている
- Origin/Refererヘッダーチェック
- 特別なヘッダー（`Next-Action`）要求
- **追加のCSRFトークン実装は不要**

**Java API:**
- 内部ネットワークのみ公開の場合: 外部からのCSRF攻撃は物理的に不可能
- 公開する場合: Spring Security等でCSRF対策が必要

### フロー順序チェック

**フロントエンドのguard:**
- UX改善のみ（ユーザーの誤操作防止）
- セキュリティ保証ではない（改ざん可能）

**バックエンドのRedisチェック:**
- セキュリティの最終防衛線
- API直叩きを防止
- 正しい順序を強制

## 注意事項

### Server Actionは他の場所からも呼べる

Server Actionは単なる関数なので、技術的にはどこからでも呼び出し可能：

```typescript
// 悪意のある呼び出し例
import { completeFlow } from '@/features/multi_flow/actions/completeFlow';

// InputScreenから直接呼ぶことも可能（ConfirmScreenをスキップ）
await completeFlow(someData);
```

**対策:**
- バックエンド（Java API）でのRedis検証が必須
- フロントのguardはUX改善のみと割り切る

### リプレイ攻撃への対策

ワンタイム処理を実装：
```java
// 処理後にRedisから状態を削除
redisTemplate.delete("flow:" + userId + ":state");
```

同じトークン/状態を使い回せないようにする。

## ディレクトリ構成例

```
features/[feature]/
├── providers/
│   └── FlowProvider.tsx          # Context Provider
├── hooks/
│   └── useFlowContext.ts         # Context hook
├── actions/
│   ├── startFlow.ts              # Server Action（将来: Java API呼び出し）
│   └── completeFlow.ts           # Server Action（将来: Java API呼び出し）
├── screens/
│   ├── InputScreen.tsx           # A画面
│   ├── ConfirmScreen.tsx         # B画面
│   └── CompleteScreen.tsx        # C画面
├── routes.ts                     # ルーティング定数
└── types.ts                      # 型定義

app/[feature]/
├── layout.tsx                    # FlowProvider配置
├── input/page.tsx                # A画面（guard不要）
├── confirm/page.tsx              # B画面（guard付き）
└── complete/page.tsx             # C画面（guard付き）
```

## まとめ

| 項目 | 実装方法 | 目的 |
|------|----------|------|
| **フロントエンド** | React Context + Page Guard | UX改善 |
| **バックエンド** | Java API + Redis検証 | セキュリティ保証 |
| **CSRF対策** | Next.js自動保護 | 外部からの攻撃防止 |
| **状態永続化** | 不要（メモリのみ） | リロードで自動リセット |

**重要:** フロントのguardは改ざん可能なので、セキュリティはバックエンドで担保すること。
