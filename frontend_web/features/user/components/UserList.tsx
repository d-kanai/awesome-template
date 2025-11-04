"use client";

import { Card } from "@/features/shared/figma_generated/Card";
import { type User, useUserList } from "../hooks/useUserList";

/**
 * UserListItem
 * ユーザーリストの各アイテムを表示するコンポーネント
 */
function UserListItem({ user }: { user: User }) {
  return (
    <div className="border-b border-gray-200 p-4 last:border-b-0">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{user.email}</h3>
          <p className="text-sm text-gray-500">ID: {user.id}</p>
        </div>
        <div className="text-sm text-gray-400">
          {new Date(user.createdAt).toLocaleDateString("ja-JP")}
        </div>
      </div>
    </div>
  );
}

/**
 * UserList
 * ユーザー一覧を表示するコンポーネント
 */
export function UserList() {
  const { data: users, isLoading, error } = useUserList();

  if (isLoading) {
    return (
      <Card>
        <div className="p-8 text-center">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="p-8 text-center">
          <p className="text-red-600">
            {error instanceof Error
              ? error.message
              : "ユーザー一覧の取得に失敗しました"}
          </p>
        </div>
      </Card>
    );
  }

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
