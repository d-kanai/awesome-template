"use client";

import type { UserListItem as User } from "@/features/shared/api/generated/model";
import { Card } from "@/features/shared/figma_generated/Card";

function UserListItem({ user }: { user: User }) {
  return (
    <div className="border-b border-gray-200 p-4 last:border-b-0">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{user.email}</h3>
          <p className="text-sm text-gray-500">ID: {user.id}</p>
        </div>
        <div className="text-sm text-gray-400">
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
        <div className="p-8 text-center">
          <p className="text-gray-500">ユーザーが見つかりません</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="divide-y divide-gray-200">
        {users.map((user) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </div>
    </Card>
  );
}
