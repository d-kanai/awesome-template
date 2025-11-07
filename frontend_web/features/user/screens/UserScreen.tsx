"use client";

import type { UserListItem } from "@/features/shared/api/generated/model";
import { UserList } from "../components/UserList";
import { UserTestIds } from "../test-ids";

interface UserScreenProps {
	users: UserListItem[];
}

function ScreenContainer({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-sds_light-Background-Default-Secondary py-Space-800">
			{children}
		</div>
	);
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className="mx-auto max-w-4xl px-Space-400 sm:px-Space-600 lg:px-Space-800">
			{children}
		</div>
	);
}

function PageHeader() {
	return (
		<div className="mb-Space-800">
			<h1
				className="text-3xl font-bold text-sds_light-Text-Default-Default"
				data-testid={UserTestIds.pageTitle}
			>
				ユーザー一覧
			</h1>
			<p className="mt-Space-200 text-sm text-sds_light-Text-Default-Secondary">
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
