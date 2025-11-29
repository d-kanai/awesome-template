"use client";

import type { UserListItem } from "@/shared/api/generated/model";
import { UserList } from "../components/UserList";
import { UserTestIds } from "../ids";

interface UserScreenProps {
  users: UserListItem[];
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-[var(--sds-size-space-400)] sm:px-[var(--sds-size-space-600)] lg:px-[var(--sds-size-space-800)]">
      {children}
    </div>
  );
}

function PageHeader() {
  return (
    <div className="mb-[var(--sds-size-space-800)]">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-subtitle text-[var(--sds-color-text-default-default)]"
            data-testid={UserTestIds.pageTitle}
          >
            ユーザー一覧
          </h1>
          <p className="mt-[var(--sds-size-space-200)] text-body-small text-[var(--sds-color-text-default-secondary)]">
            登録されているユーザーの一覧です
          </p>
        </div>
      </div>
    </div>
  );
}

function UserListSection({ users }: { users: UserListItem[] }) {
  return <UserList users={users} />;
}

export function UserScreen({ users }: UserScreenProps) {
  return (
    <div className="bg-[var(--sds-color-background-default-secondary)] py-[var(--sds-size-space-800)]">
      <ContentWrapper>
        <PageHeader />
        <UserListSection users={users} />
      </ContentWrapper>
    </div>
  );
}
