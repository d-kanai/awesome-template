import { getAllUsers } from "@/features/shared/api/generated/functions";
import { UserScreen } from "@/features/user/screens/UserScreen";

/**
 * ユーザー一覧ページ
 * Server Componentで直接データを取得
 */
export default async function UserPage() {
  // Server Componentで直接データ取得
  const response = await getAllUsers();
  const users = response.data?.users || [];

  return <UserScreen users={users} />;
}
