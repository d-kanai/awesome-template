"use client";

import type { UserListItem as User } from "@/features/shared/api/generated/model";
import { UserTestIds } from "../test-ids";

function UserListItem({ user }: { user: User }) {
  return (
    <div
      className="border-b border-[var(--sds-color-border-default-default,#d9d9d9)] p-[var(--sds-size-space-400,16px)] last:border-b-0"
      data-testid={UserTestIds.userListItem}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)] font-[var(--sds-typography-body-font-weight-strong,600)] text-[length:var(--sds-typography-body-size-medium,16px)] leading-[1.4] text-[color:var(--sds-color-text-default-default,#1e1e1e)]"
            data-testid={UserTestIds.userEmail}
          >
            {user.email}
          </h3>
          <p
            className="font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] text-[length:var(--sds-typography-body-size-small,14px)] leading-[1.4] text-[color:var(--sds-color-text-default-secondary,#757575)]"
            data-testid={UserTestIds.userId}
          >
            ID: {user.id}
          </p>
        </div>
        <div
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] text-[length:var(--sds-typography-body-size-small,14px)] leading-[1.4] text-[color:var(--sds-color-text-default-tertiary,#b3b3b3)]"
          data-testid={UserTestIds.userCreatedAt}
        >
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString("ja-JP")
            : "-"}
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
      <div className="bg-[var(--sds-color-background-default-default,#ffffff)] border-[var(--sds-color-border-default-default,#d9d9d9)] border-[var(--sds-size-stroke-border,1px)] border-solid rounded-[var(--sds-size-radius-200,8px)] p-[var(--sds-size-space-800,32px)] text-center">
        <p
          className="font-[family-name:var(--sds-typography-body-font-family,'Inter',sans-serif)] font-[var(--sds-typography-body-font-weight-regular,400)] text-[length:var(--sds-typography-body-size-medium,16px)] leading-[1.4] text-[color:var(--sds-color-text-default-secondary,#757575)]"
          data-testid={UserTestIds.emptyMessage}
        >
          ユーザーが見つかりません
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-[var(--sds-color-background-default-default,#ffffff)] border-[var(--sds-color-border-default-default,#d9d9d9)] border-[var(--sds-size-stroke-border,1px)] border-solid rounded-[var(--sds-size-radius-200,8px)]"
      data-testid={UserTestIds.userList}
    >
      {users.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </div>
  );
}
