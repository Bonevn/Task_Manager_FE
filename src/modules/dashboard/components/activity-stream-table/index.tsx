import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/modules/ui/table";
import { useGetAllTaskActivities } from "@/modules/tasks/api/hooks";

const activityStream = [
	{
		user: "John Doe", 
		summary: "Implement user authentication flow",
	},
	{
		user: "Jane Doe",
		summary: "Design responsive dashboard layout",
	},
	{
		user: "John Doe",
		summary: "Fix pagination bug in table component",
	},
	{
		user: "Jane Doe",
		summary: "Add dark mode theme support",
	},
	{
		user: "Jane Doe",
		summary: "Optimize API response caching",
	},
	{
		user: "Jane Doe",
		summary: "Create reusable form components",
	},
	{
		user: "Jane Doe",
		summary: "Update documentation for new features",
	},
];

export function ActivityStreamTable() {
	const { data: activities, isLoading } = useGetAllTaskActivities();
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between bg-black h-8 rounded-md px-3">
				<p className="text-lg font-bold text-white">Activity stream</p>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
					<TableHead className="w-[100px]">User</TableHead>
					<TableHead>Summary</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{activities?.data.map((activity, index) => (
					<TableRow key={index}>
						<TableCell className="font-medium">{activity.user?.name}</TableCell>
						<TableCell>{activity.content}</TableCell>
					</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
