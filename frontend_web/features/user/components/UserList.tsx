"use client";

import type { UserListItem as User } from "@/features/shared/api/generated/model";
import { Card } from "@/features/shared/figma_generated/Card";
import { UserTestIds } from "../test-ids";

function UserListItem({ user }: { user: User }) {
  return (
    <div
      className="border-b border-border p-Space-400 last:border-b-0"
      data-testid={UserTestIds.userListItem}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="text-body-strong text-foreground"
            data-testid={UserTestIds.userEmail}
          >
            {user.email}
          </h3>
          <p
            className="text-body-small text-foreground-secondary"
            data-testid={UserTestIds.userId}
          >
            ID: {user.id}
          </p>
        </div>
        <div
          className="text-body-small text-foreground-tertiary"
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
      <Card>
        <div className="p-Space-800 text-center">
          <p
            className="text-body-base text-foreground-secondary"
            data-testid={UserTestIds.emptyMessage}
          >
            ユーザーが見つかりません
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div
        className="divide-y divide-border"
        data-testid={UserTestIds.userList}
      >
        {users.map((user) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </div>
    </Card>
  );
}
