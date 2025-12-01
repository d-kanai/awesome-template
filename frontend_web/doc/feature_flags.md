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

## 📋 現在のフラグ一覧

| フラグ名 | 説明 | dev/staging | prod |
|---------|------|-------------|------|
| `showVersionInfo` | バージョン情報表示 | ✅ ON | userId=1のみ |

## 💡 判定条件の例

```typescript
// 環境ベース
if (isDev) return true;
if (isStaging) return true;

// ユーザーベース
if (ctx.userId === "1") return true;

// 割合ベース (将来)
if (hashUserId(ctx.userId) % 100 < 10) return true; // 10%
```
