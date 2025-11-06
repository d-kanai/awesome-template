"use client";

import type { UserListItem } from "@/features/shared/api/generated/model";
import { UserList } from "../components/UserList";
import { UserTestIds } from "../test-ids";

interface UserScreenProps {
  users: UserListItem[];
}

function ScreenContainer({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50 py-8">{children}</div>;
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">{children}</div>
  );
}

function PageHeader() {
  return (
    <div className="mb-8">
      <h1
        className="text-3xl font-bold text-gray-900"
        data-testid={UserTestIds.pageTitle}
      >
        ユーザー一覧
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        登録されているユーザーの一覧です
      </p>
    </div>
  );
}

function UserListSection({ users }: { users: UserListItem[] }) {
  return <UserList users={users} />;
}

export function UserScreen({ users }: UserScreenProps) {
  return (
    <ScreenContainer>
      <ContentWrapper>
        <PageHeader />
        <UserListSection users={users} />
      </ContentWrapper>
    </ScreenContainer>
  );
}
