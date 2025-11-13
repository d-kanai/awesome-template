import { getSession } from "@/features/auth/queries/getSession";
import { AUTH_ROUTES } from "@/features/auth/routes";
import { USER_ROUTES } from "@/features/user/routes";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await getSession();

  if (session.isAuthenticated) {
    redirect(USER_ROUTES.USER_LIST);
  } else {
    redirect(AUTH_ROUTES.SIGNIN);
  }
}
