"use client";

import type { UserListItem as User } from "@/features/shared/api/generated/model";
import { Card } from "@/features/shared/figma_generated/Card";
import { UserTestIds } from "../test-ids";

function UserListItem({ user }: { user: User }) {
	return (
		<div
			className="border-b border-sds_light-Border-Default-Default p-Space-400 last:border-b-0"
			data-testid={UserTestIds.userListItem}
		>
			<div className="flex items-center justify-between">
				<div>
					<h3
						className="font-medium text-sds_light-Text-Default-Default"
						data-testid={UserTestIds.userEmail}
					>
						{user.email}
					</h3>
					<p
						className="text-sm text-sds_light-Text-Default-Secondary"
						data-testid={UserTestIds.userId}
					>
						ID: {user.id}
					</p>
				</div>
				<div
					className="text-sm text-sds_light-Text-Default-Tertiary"
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
						className="text-sds_light-Text-Default-Secondary"
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
				className="divide-y divide-sds_light-Border-Default-Default"
				data-testid={UserTestIds.userList}
			>
				{users.map((user) => (
					<UserListItem key={user.id} user={user} />
				))}
			</div>
		</Card>
	);
}
