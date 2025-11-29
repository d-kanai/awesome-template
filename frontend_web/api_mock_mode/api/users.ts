/**
 * Mock data for Users API
 */

import type { UserListItem } from "@/features/shared/api/generated/model";

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
