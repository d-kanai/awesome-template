/**
 * Mock data for User Voices API
 */

import type { UserVoice } from "@/features/shared/api/generated/model";

export const mockUserVoices: UserVoice[] = [
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

// Alias for backward compatibility
export const mockTestimonials = mockUserVoices;
