"use client";

import type { UserListItem } from "@/features/shared/api/generated/model";
import { UserList } from "../components/UserList";

/**
 * UserScreen
 * ユーザー一覧画面
 * - Server Componentから取得したデータをpropsで受け取る
 */
interface UserScreenProps {
  users: UserListItem[];
}

export function UserScreen({ users }: UserScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ユーザー一覧</h1>
          <p className="mt-2 text-sm text-gray-600">
            登録されているユーザーの一覧です
          </p>
        </div>
        <UserList users={users} />
      </div>
    </div>
  );
}
