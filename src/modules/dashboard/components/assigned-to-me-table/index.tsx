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
import { useGetAllTasks } from "@/modules/tasks/api/hooks";
import { useRouter } from "next/navigation";
const assignedTasks = [
	{
		key: "INV001", 
		summary: "Implement user authentication flow",
	},
	{
		key: "INV002",
		summary: "Design responsive dashboard layout",
	},
	{
		key: "INV003",
		summary: "Fix pagination bug in table component",
	},
	{
		key: "INV004",
		summary: "Add dark mode theme support",
	},
	{
		key: "INV005",
		summary: "Optimize API response caching",
	},
	{
		key: "INV006",
		summary: "Create reusable form components",
	},
	{
		key: "INV007",
		summary: "Update documentation for new features",
	},
];

export function AssignedToMeTable() {
	const { data: tasks, isLoading } = useGetAllTasks();
	const router = useRouter();
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between bg-black h-8 rounded-md px-3">
				<p className="text-lg font-bold text-white">New Tasks</p>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
					<TableHead className="w-[100px]">ID</TableHead>
					<TableHead>Summary</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{tasks?.data.map((task) => (
					<TableRow key={task.id}>
						<TableCell className="font-medium cursor-pointer hover:text-blue-500" onClick={() => router.push(`/dashboard/task/${task.id}`)}>{task.id.split("-")[0]}</TableCell>
						<TableCell>{task.description}</TableCell>
					</TableRow>
				))}
				</TableBody>
			</Table>
		</div>
	);
}
