import { useFlag } from "@unleash/proxy-client-react";

/**
 * useFeatureFlag
 * Unleashの機能フラグを取得するカスタムフック
 *
 * @param flagName - 機能フラグ名（FEATURE_FLAGS定数から取得）
 * @returns 機能フラグの有効/無効状態
 */
export function useFeatureFlag(flagName: string): boolean {
  return useFlag(flagName);
}
