import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/actions/getSession";

export default async function RootPage() {
  const session = await getSession();

  if (session.isAuthenticated) {
    redirect("/user");
  } else {
    redirect("/auth/signin");
  }
}
