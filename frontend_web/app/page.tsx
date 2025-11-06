import { getSession } from "@/features/auth/actions/getSession";
import { ROUTES } from "@/features/shared/lib/constants";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await getSession();

  if (session.isAuthenticated) {
    redirect(ROUTES.USER_LIST);
  } else {
    redirect(ROUTES.SIGNIN);
  }
}
