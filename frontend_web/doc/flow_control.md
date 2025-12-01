# 🔄 フロー制御

## 📋 概要

マルチステップフロー（A → B → C）の**直アクセス防止**と**順序制御**。

```
┌─────────┐     ┌─────────┐     ┌──────────┐
│ A:Input │ ──► │B:Confirm│ ──► │C:Complete│
└─────────┘     └─────────┘     └──────────┘
     │               │                │
     └───────────────┴────────────────┘
              直アクセス → Aへリダイレクト
```

## 🛡️ 2段階防御

| 層 | 実装 | 目的 |
|----|------|------|
| **Frontend** | Zustand Store + Page Guard | UX改善 |
| **Backend** | Java API + Redis | セキュリティ保証 |

## 🎯 実装パターン

### 1️⃣ Zustand Store

```typescript
// stores/useFlowStore.ts
export const useFlowStore = create<FlowState>((set) => ({
  currentStep: null,
  formData: null,
  goToConfirm: (data) => set({ currentStep: "confirm", formData: data }),
  goToComplete: () => set({ currentStep: "complete" }),
  reset: () => set({ currentStep: null, formData: null }),
}));
```

### 2️⃣ Page Guard

```typescript
// app/[feature]/confirm/page.tsx
export default function ConfirmPage() {
  const { currentStep } = useFlowStore();
  const router = useRouter();

  useEffect(() => {
    if (currentStep !== "confirm") router.replace(ROUTES.INPUT);
  }, [currentStep]);

  if (currentStep !== "confirm") return null;
  return <ConfirmScreen />;
}
```

### 3️⃣ 画面遷移

```typescript
// A画面: goToConfirm(data) → router.push(B)
// B画面: goToComplete() → router.push(C)
// C画面: useEffect(() => reset(), [])
```

## 🔐 セキュリティ

| 項目 | 対策 |
|------|------|
| CSRF | Next.js Server Action自動保護 |
| 順序チェック | Backend Redis検証 |
| リプレイ攻撃 | 処理後にRedis状態削除 |

## ⚠️ 注意

**Frontendのguardは改ざん可能** → セキュリティはBackendで担保
