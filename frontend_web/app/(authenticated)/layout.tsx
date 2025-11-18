import { AuthenticatedLayout } from "@/features/shared/layouts/AuthenticatedLayout";

export default function AuthenticatedLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
