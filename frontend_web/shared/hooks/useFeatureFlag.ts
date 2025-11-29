import { useEffect } from "react";
import { useFeatureFlagStore } from "@/shared/stores/useFeatureFlagStore";

/**
 * useFeatureFlag
 * Zustandストアから機能フラグを取得するカスタムフック
 *
 * @param flagName - 機能フラグ名（FEATURE_FLAGS定数から取得）
 * @returns 機能フラグの有効/無効状態
 */
export function useFeatureFlag(flagName: string): boolean {
  const { flags, fetchFlags, isLoading } = useFeatureFlagStore();

  useEffect(() => {
    // 初回のみフェッチ（フラグが空の場合）
    if (Object.keys(flags).length === 0 && !isLoading) {
      fetchFlags();
    }
  }, [flags, isLoading, fetchFlags]);

  return flags[flagName] ?? false;
}
