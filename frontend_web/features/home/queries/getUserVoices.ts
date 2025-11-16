import { getUserVoices as getUserVoicesAPI } from "@/features/shared/api/generated/functions";
import type { UserVoice } from "@/features/shared/api/generated/model";
import { cache } from "react";

export type { UserVoice };

/**
 * Get user voices data
 * Server-side query function using Orval-generated API client
 * Wrapped with React.cache for request deduplication
 *
 * Note: バックエンド未実装。NEXT_PUBLIC_API_MOCK_MODE=enabled でモックデータを使用
 */
export const getUserVoices = cache(async (): Promise<UserVoice[]> => {
  const response = await getUserVoicesAPI();
  return response.data.userVoices || [];
});
