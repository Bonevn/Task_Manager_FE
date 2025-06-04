import TaskDetailBodyItem from "./components/task-detail-body-item";
import { ChevronUp, ChevronDown, Equal, SquareCheck } from "lucide-react";

interface TaskBasicDetailsProps {
	priority: string;
	resolution: string;
	parentId: string;
	status: string;
	dueDate: string;
}

export default function TaskBasicDetails({
	priority,
	resolution,
	parentId,
	status,
	dueDate,
}: TaskBasicDetailsProps) {
	return (
		<TaskDetailBodyItem
			title="Details"
			items={[
				{
					key: "Type",
					value: (
						<div className="flex flex-row items-center gap-2">
							{parentId ? (
								<SquareCheck
									className="h-4 w-4 text-blue-500"
									strokeWidth={3}
								/>
							) : (
								<SquareCheck
									className="h-4 w-4 text-green-500"
									strokeWidth={3}
								/>
							)}
							{parentId ? "Subtask" : "Task"}
						</div>
					),
				},
				{
					key: "Priority",
					value: (
						<div className="flex flex-row items-center gap-2">
							{priority === "MEDIUM" ? (
								<Equal
									className="h-4 w-4 text-yellow-500"
									strokeWidth={3}
								/>
							) : priority === "HIGH" ? (
								<ChevronUp
									className="h-4 w-4 text-red-500"
									strokeWidth={3}
								/>
							) : priority === "LOW" ? (
								<ChevronDown
									className="h-4 w-4 text-green-500"
									strokeWidth={3}
								/>
							) : null}
							{priority.charAt(0).toUpperCase() +
								priority.slice(1)}
						</div>
					),
				},
				{
					key: "Resolution",
					value: (
						<p>{status === "DONE" ? "Resolved" : "Unresolved"}</p>
					),
				},
				{
					key: "Due Date",
					value: (
						<p>{dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}</p>
					),
				},
			]}
		/>
	);
}
