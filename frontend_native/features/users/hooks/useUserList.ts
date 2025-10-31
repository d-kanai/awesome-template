import { useGetAllUsers } from "@/api/generated";
import type { UserListItem } from "@/api/generated";

export type User = UserListItem & { createdAt?: Date; updatedAt?: Date };

export function useUserList() {
  const usersQuery = useGetAllUsers({
    query: {
      select: (response) => response.data?.users ?? [],
      staleTime: 30_000,
    },
  });

  const users: User[] = (usersQuery.data ?? []).map((user) => ({
    ...user,
    createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
    updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
  }));

  return {
    users,
    refetch: usersQuery.refetch,
  };
}
