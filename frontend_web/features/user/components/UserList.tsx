"use client";

import type { UserListItem as User } from "@/features/shared/api/generated/model";
import { UserTestIds } from "../test-ids";

function UserListItem({ user }: { user: User }) {
  return (
    <div
      className="border-b border-border p-Space-400 last:border-b-0 hover:bg-muted/50 transition-colors"
      data-testid={UserTestIds.userListItem}
    >
      <div className="flex items-center justify-between gap-Space-400">
        <div className="flex-1 min-w-0">
          <h3
            className="text-body-medium font-semibold text-foreground truncate"
            data-testid={UserTestIds.userEmail}
          >
            {user.email}
          </h3>
          <p
            className="text-body-small text-foreground-secondary mt-Space-50"
            data-testid={UserTestIds.userId}
          >
            ID: {user.id}
          </p>
        </div>
        <time
          className="text-body-small text-foreground-tertiary shrink-0"
          data-testid={UserTestIds.userCreatedAt}
          dateTime={user.createdAt}
        >
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString("ja-JP")
            : "-"}
        </time>
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
      <div className="bg-background border border-border rounded-Radius-200 p-Space-800 text-center">
        <p
          className="text-body-medium text-foreground-secondary"
          data-testid={UserTestIds.emptyMessage}
        >
          ユーザーが見つかりません
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-background border border-border rounded-Radius-200 overflow-hidden shadow-sm"
      data-testid={UserTestIds.userList}
    >
      {users.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </div>
  );
}
