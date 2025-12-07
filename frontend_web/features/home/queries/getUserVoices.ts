import { cache } from "react";

/**
 * UserVoice type definition
 * Note: バックエンド未実装のためローカルで定義
 */
export type UserVoice = {
  quote: string;
  title: string;
  description: string;
  avatarSrc: string;
};

/**
 * Get user voices data
 * Server-side query function
 * Wrapped with React.cache for request deduplication
 *
 * Note: バックエンド未実装。モックデータを使用
 */
export const getUserVoices = cache(async (): Promise<UserVoice[]> => {
  // バックエンド未実装のため、モックデータを返す
  return [
    {
      quote:
        "This product has completely transformed how we work. Highly recommended!",
      title: "Sarah Johnson",
      description: "CEO, TechCorp",
      avatarSrc: "https://i.pravatar.cc/150?img=1",
    },
    {
      quote: "The best investment we've made for our business this year.",
      title: "Michael Chen",
      description: "Product Manager, StartupXYZ",
      avatarSrc: "https://i.pravatar.cc/150?img=2",
    },
    {
      quote:
        "Outstanding service and support. The team really cares about their customers.",
      title: "Emma Wilson",
      description: "Designer, Creative Agency",
      avatarSrc: "https://i.pravatar.cc/150?img=3",
    },
  ];
});
