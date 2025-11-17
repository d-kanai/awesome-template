import { getAllUsers } from "@/features/shared/api/generated/functions";
import { UserScreen } from "@/features/user/screens/UserScreen";

export const dynamic = "force-dynamic";

export default async function UserPage() {
  const response = await getAllUsers();
  const users = response.data?.users || [];

  return <UserScreen users={users} />;
}
