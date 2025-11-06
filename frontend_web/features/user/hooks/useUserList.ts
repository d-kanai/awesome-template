import { useGetAllUsers } from "@/features/shared/api/generated/hooks";
import type { UserListItem } from "@/features/shared/api/generated/model";

export type User = UserListItem;

/**
 * useUserList
 * ユーザー一覧を取得するカスタムフック
 * Note: このhookはClient Componentsで使用。Server ComponentsではgetAllUsers()を直接使用
 */
export function useUserList() {
  const query = useGetAllUsers();

  return {
    ...query,
    data: query.data?.data?.users,
  };
}
