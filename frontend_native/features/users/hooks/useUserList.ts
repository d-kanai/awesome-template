import {
  type UseSuspenseQueryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { type getAllUsers, getGetAllUsersQueryOptions } from "@/api/generated";
import type { UserListItem } from "@/api/generated/model";

export type User = Omit<UserListItem, "createdAt" | "updatedAt"> & {
  createdAt?: Date;
  updatedAt?: Date;
};

export function useUserList() {
  const queryOptions = getGetAllUsersQueryOptions<UserListItem[]>({
    query: {
      select: (response) => response.data?.users ?? [],
      staleTime: 30_000,
    },
  }) as UseSuspenseQueryOptions<
    Awaited<ReturnType<typeof getAllUsers>>,
    unknown,
    UserListItem[]
  >;

  const usersQuery = useSuspenseQuery<
    Awaited<ReturnType<typeof getAllUsers>>,
    unknown,
    UserListItem[]
  >(queryOptions);

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
