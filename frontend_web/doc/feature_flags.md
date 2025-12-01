# 🚩 Feature Flags

機能の段階的リリースやA/Bテストを実現するためのフラグ管理。

## 📁 ファイル構成

```
shared/lib/featureFlags.ts
```

## 🔧 使い方

### RSC (Server Component) での使用

```typescript
import { getFeatureFlags } from "@/shared/lib/featureFlags";

export default async function Page() {
  const flags = await getFeatureFlags();

  return (
    <div>
      {flags.showVersionInfo && <VersionBadge />}
    </div>
  );
}
```

## ➕ 新しいフラグの追加手順

1. **判定関数を追加**
   ```typescript
   function isNewFeatureEnabled(ctx: UserContext): boolean {
     if (isDev || isStaging) return true;  // dev/stagingは常にON
     if (ctx.userId === "1") return true;  // 特定ユーザーのみON
     return false;                          // prodはOFF
   }
   ```

2. **getFeatureFlagsの戻り値に追加**
   ```typescript
   export async function getFeatureFlags() {
     const ctx = await getUserContext();
     return {
       showVersionInfo: isShowVersionInfoEnabled(ctx),
       newFeature: isNewFeatureEnabled(ctx),  // ← 追加
     } as const;
   }
   ```

## 💡 判定条件の例

```typescript
// 環境ベース
if (isDev) return true;
if (isStaging) return true;

// ユーザーベース
if (ctx.userId === "1") return true;

// 割合ベース（A/Bテスト）
// userIdを数値化して剰余で判定（同じユーザーは常に同じ結果）
const userIdNum = parseInt(ctx.userId || "0", 10);
if (userIdNum % 100 < 10) return true; // 10%ロールアウト
```

## 🧪 A/Bテストの実装例

```typescript
// 50%のユーザーに新UIを表示
function isNewUIEnabled(ctx: UserContext): boolean {
  if (isDev || isStaging) return true;
  if (!ctx.userId) return false;

  const userIdNum = parseInt(ctx.userId, 10);
  return userIdNum % 2 === 0; // 偶数ユーザーに表示
}

// 段階的ロールアウト（10% → 50% → 100%）
function isGradualRolloutEnabled(ctx: UserContext): boolean {
  if (isDev || isStaging) return true;
  if (!ctx.userId) return false;

  const userIdNum = parseInt(ctx.userId, 10);
  const rolloutPercent = 10; // ここを変更: 10 → 50 → 100
  return userIdNum % 100 < rolloutPercent;
}
```

### コンポーネントでの使用

```typescript
export default async function Page() {
  const flags = await getFeatureFlags();

  return (
    <div>
      {flags.newUI ? <NewCheckoutFlow /> : <OldCheckoutFlow />}
    </div>
  );
}
```
