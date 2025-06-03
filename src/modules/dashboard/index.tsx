"use client";
import { AssignedToMeTable } from "./components/assigned-to-me-table";
import { ActivityStreamTable } from "./components/activity-stream-table";
import { TaskPieChart } from "./components/task-pie-chart";
import { useGetSelf } from "@/modules/user-settings/api/hooks";
import { ProjectProgressDashboard } from "./components/project-progress";

export function Dashboard() {
	const { data: user } = useGetSelf();

	return (
		<div className="flex flex-col gap-8">
			<div>
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-gray-500">Welcome to the personal task manager</p>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<TaskPieChart />
				<ProjectProgressDashboard />
				<AssignedToMeTable />
				{user?.role === "ADMIN" && <ActivityStreamTable />}
			</div>
		</div>
	);
}
