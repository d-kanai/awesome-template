import { getAllUsers } from "@/features/shared/api/generated/functions";
import { UserScreen } from "@/features/user/screens/UserScreen";

export default async function UserPage() {
  const response = await getAllUsers();
  const users = response.data?.users || [];

  return <UserScreen users={users} />;
}
