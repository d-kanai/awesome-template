import { getAllUsers } from "@/features/shared/api/generated/functions";
import { UserScreen } from "@/features/user/screens/UserScreen";
import { COOKIE_KEYS } from "@/features/shared/lib/constants";
import { cookies } from "next/headers";

export default async function UserPage() {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN);

  const response = await getAllUsers({
    headers: accessTokenCookie
      ? {
          Cookie: `${accessTokenCookie.name}=${accessTokenCookie.value}`,
        }
      : undefined,
  });
  const users = response.data?.users || [];

  return <UserScreen users={users} />;
}
