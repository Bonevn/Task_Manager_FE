"use client";

import { UserRow } from "./components/user-row";
import { useGetAllUsers } from "../user-settings/api/hooks";

export default function SystemUsers() {
	const { data: users, isLoading } = useGetAllUsers();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col h-full gap-8">
			<div className="flex flex-col gap-0.5">
				<p className="text-sm text-gray-500">Settings</p>
				<p className="text-2xl font-bold">System Users</p>
			</div>
			<div className="flex flex-col gap-4 w-1/2">
				{users?.data.map((user) => (
					<UserRow key={user.id} user={user} />
				))}
			</div>
		</div>
	);
}
