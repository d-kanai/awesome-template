import { getAllUsers } from "@/features/user/queries/getAllUsers";
import { UserScreen } from "@/features/user/screens/UserScreen";

export const dynamic = "force-dynamic";

export default async function UserPage() {
  const users = await getAllUsers();

  return <UserScreen users={users} />;
}
