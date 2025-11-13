import { getTestimonials as getTestimonialsAPI } from "@/features/shared/api/generated/functions";
import type { Testimonial } from "@/features/shared/api/generated/model";
import { cache } from "react";

export type { Testimonial };

/**
 * Get testimonials data
 * Server-side query function using Orval-generated API client
 * Wrapped with React.cache for request deduplication
 *
 * Note: バックエンド未実装。NEXT_PUBLIC_API_MOCK_MODE=enabled でモックデータを使用
 */
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const response = await getTestimonialsAPI();
  return response.data.testimonials;
});
