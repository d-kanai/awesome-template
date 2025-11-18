"use client";

import type { UserListItem as User } from "@/features/shared/api/generated/model";
import { UserTestIds } from "../test-ids";

function UserAvatar({ email }: { email: string }) {
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[var(--sds-size-radius-full)] bg-[var(--sds-color-background-brand-default)] text-heading text-[var(--sds-color-text-brand-on-brand)] shadow-sm">
      {initial}
    </div>
  );
}

function UserListItem({ user }: { user: User }) {
  return (
    <div
      className="group relative overflow-hidden rounded-[var(--sds-size-radius-200)] border border-[var(--sds-color-border-default-default)] bg-[var(--sds-color-background-default-default)] p-[var(--sds-size-space-600)] transition-all hover:shadow-md hover:border-[var(--sds-color-border-brand-default)]"
      data-testid={UserTestIds.userListItem}
    >
      <div className="flex items-start gap-[var(--sds-size-space-500)]">
        <UserAvatar email={user.email} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-[var(--sds-size-space-400)]">
            <div className="flex-1 min-w-0">
              <h3
                className="text-body-medium font-semibold text-[var(--sds-color-text-default-default)] truncate group-hover:text-[var(--sds-color-text-brand-default)] transition-colors"
                data-testid={UserTestIds.userEmail}
              >
                {user.email}
              </h3>
              <p
                className="text-caption text-[var(--sds-color-text-default-tertiary)] mt-[var(--sds-size-space-200)]"
                data-testid={UserTestIds.userId}
              >
                {user.id}
              </p>
            </div>
            <div className="flex flex-col items-end gap-[var(--sds-size-space-200)] shrink-0">
              <span className="inline-flex items-center rounded-[var(--sds-size-radius-full)] bg-[var(--sds-color-background-brand-subtlest)] px-[var(--sds-size-space-300)] py-[var(--sds-size-space-100)] text-caption font-medium text-[var(--sds-color-text-brand-default)]">
                Active
              </span>
              <time
                className="text-caption text-[var(--sds-color-text-default-secondary)]"
                data-testid={UserTestIds.userCreatedAt}
                dateTime={user.createdAt}
              >
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "-"}
              </time>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  if (!users || users.length === 0) {
    return (
      <div className="bg-[var(--sds-color-background-default-default)] border border-[var(--sds-color-border-default-default)] rounded-[var(--sds-size-radius-200)] p-[var(--sds-size-space-800)] text-center">
        <p
          className="text-body-medium text-[var(--sds-color-text-default-secondary)]"
          data-testid={UserTestIds.emptyMessage}
        >
          ユーザーが見つかりません
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-[var(--sds-size-space-400)]"
      data-testid={UserTestIds.userList}
    >
      {users.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </div>
  );
}
