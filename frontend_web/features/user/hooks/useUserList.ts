import {
  useGetAllUsers,
  type UserListItem,
} from "@/features/shared/api/generated";

export type User = UserListItem;

/**
 * useUserList
 * ユーザー一覧を取得するカスタムフック
 */
export function useUserList() {
  const query = useGetAllUsers();

  return {
    ...query,
    data: query.data?.users,
  };
}
