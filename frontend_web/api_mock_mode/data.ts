/**
 * Mock data for all APIs
 * Used when NEXT_PUBLIC_API_MOCK_MODE=enabled
 * Provides mock responses for both openapi.json and production APIs
 */

import type {
  Testimonial,
  UserListItem,
  UserVoice,
} from "@/features/shared/api/generated/model";

// ============================================
// Testimonials (openapi.json)
// ============================================
export const mockTestimonials: Testimonial[] = [
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

// ============================================
// User Voices (openapi.json)
// ============================================
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

// ============================================
// Users (production API)
// ============================================
export const mockUsers: UserListItem[] = [
  {
    id: "user-1",
    email: "sarah.johnson@example.com",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "user-2",
    email: "michael.chen@example.com",
    createdAt: "2024-02-20T14:45:00Z",
    updatedAt: "2024-02-20T14:45:00Z",
  },
  {
    id: "user-3",
    email: "emma.wilson@example.com",
    createdAt: "2024-03-10T09:15:00Z",
    updatedAt: "2024-03-10T09:15:00Z",
  },
  {
    id: "user-4",
    email: "john.doe@example.com",
    createdAt: "2024-04-05T16:20:00Z",
    updatedAt: "2024-04-05T16:20:00Z",
  },
  {
    id: "user-5",
    email: "jane.smith@example.com",
    createdAt: "2024-05-12T11:00:00Z",
    updatedAt: "2024-05-12T11:00:00Z",
  },
];

// ============================================
// Auth (production API)
// ============================================
export const mockUser = {
  id: "mock-user-id",
  name: "Mock User",
  email: "mock@example.com",
};

export const mockSigninResponse = {
  data: {
    user: mockUser,
    accessToken: "mock-access-token",
  },
  status: 200,
};

export const mockSignupResponse = {
  data: {
    user: mockUser,
    accessToken: "mock-access-token",
  },
  status: 201,
};

export const mockMeResponse = {
  data: {
    user: mockUser,
  },
  status: 200,
};
