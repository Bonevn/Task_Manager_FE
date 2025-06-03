"use client";

import { UserRow } from "./components/user-row";
import { useGetProjectUsers } from "../user-settings/api/hooks";
import { Button } from "../ui/button";
import { AddUserDialog } from "./components/add-user-dialog";

interface ProjectUsersProps {
	projectId: string;
}

export default function ProjectUsers({ projectId }: ProjectUsersProps) {
	const { data: users, isLoading } = useGetProjectUsers(projectId);


	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col h-full gap-8 w-1/2">
			<div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <p className="text-sm text-gray-500">Project Users</p>
                    <p className="text-2xl font-bold">Project Users</p>
                </div>
                <AddUserDialog projectId={projectId} />
            </div>
			<div className="flex flex-col gap-4">
				{users?.data.data.map((user) => (
					<UserRow key={user.id} user={user} projectId={projectId} />
				))}
			</div>
		</div>
	);
}
