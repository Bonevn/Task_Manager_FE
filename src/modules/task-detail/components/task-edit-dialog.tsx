"use client";
import { Button } from "@/modules/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/modules/ui/dialog";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { Textarea } from "@/modules/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/modules/ui/select";
import { Calendar } from "@/modules/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import { useGetAllUsers } from "@/modules/user-settings/api/hooks";
import { useState, useEffect } from "react";
import { useEditTask, useGetTaskById } from "@/modules/tasks/api/hooks";
import { TaskPriority } from "@/modules/tasks/api/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { UserSelect } from "@/modules/ui/user-select";

interface TaskEditDialogProps {
	buttonText: string;
	buttonIcon: React.ReactNode;
	taskId: string;
	name: string;
	description: string;
	type: "Task" | "Bug";
	priority: "Low" | "Medium" | "High";
	assignee: string;
	reporter: string;
	dueDate?: Date;
	onOpen: () => void;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function TaskEditDialog({
	buttonText,
	buttonIcon,
	taskId,
	name,
	description,
	type,
	priority,
	assignee,
	reporter,
	dueDate,
	onOpen,
	open,
	onOpenChange,
}: TaskEditDialogProps) {
	const { data: users } = useGetAllUsers();
	const { data: task } = useGetTaskById(taskId);
	const editTask = useEditTask(taskId);
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		priority: priority as "Low" | "Medium" | "High",
		assigneeId: assignee || null,
		reporterId: reporter || null,
		dueDate: dueDate || null,
	});

	useEffect(() => {
		if (task?.data) {
			setFormData({
				name: task.data.name,
				description: task.data.description,
				priority: (task.data.priority.charAt(0) +
					task.data.priority.slice(1).toLowerCase()) as
					| "Low"
					| "Medium"
					| "High",
				assigneeId: task.data.assigneeId,
				reporterId: task.data.reporterId,
				dueDate: task.data.dueDate ? new Date(task.data.dueDate) : null,
			});
		}
	}, [task?.data]);

	const handleSave = async () => {
		try {
			await editTask.mutateAsync({
				id: taskId,
				...formData,
				priority: formData.priority.toUpperCase() as TaskPriority,
				dueDate: formData.dueDate?.toISOString() || null,
			});
			toast.success("Task updated successfully");
			queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
			onOpenChange(false);
		} catch (error) {
			toast.error("Failed to update task");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Task</DialogTitle>
					<DialogDescription>Edit task details</DialogDescription>
				</DialogHeader>
				<div className="grid gap-2">
					<div className="grid grid-cols-5 gap-2">
						<Label
							htmlFor="name"
							className="col-span-1 text-right mt-3"
						>
							Name
						</Label>
						<Input
							id="name"
							placeholder="Enter task name"
							value={formData.name}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									name: e.target.value,
								}))
							}
							className="col-span-4"
						/>
					</div>
					<div className="grid grid-cols-5 gap-2">
						<Label
							htmlFor="priority"
							className="col-span-1 text-right mt-3"
						>
							Priority
						</Label>
						<Select
							value={formData.priority}
							onValueChange={(value: "Low" | "Medium" | "High") =>
								setFormData((prev) => ({
									...prev,
									priority: value,
								}))
							}
						>
							<SelectTrigger className="col-span-4">
								<SelectValue placeholder="Select priority" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Low">Low</SelectItem>
								<SelectItem value="Medium">Medium</SelectItem>
								<SelectItem value="High">High</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-5 gap-2">
						<Label
							htmlFor="reporter"
							className="col-span-1 text-right mt-3"
						>
							Reporter
						</Label>
						<UserSelect
							value={formData.reporterId}
							onValueChange={(value) =>
								setFormData((prev) => ({
									...prev,
									reporterId: value,
								}))
							}
							placeholder="Select reporter"
							className="col-span-4"
						/>
					</div>
					<div className="grid grid-cols-5 gap-2">
						<Label
							htmlFor="assignee"
							className="col-span-1 text-right mt-3"
						>
							Assignee
						</Label>
						<UserSelect
							value={formData.assigneeId}
							onValueChange={(value) =>
								setFormData((prev) => ({
									...prev,
									assigneeId: value,
								}))
							}
							placeholder="Select assignee"
							className="col-span-4"
						/>
					</div>

					<div className="grid grid-cols-5 gap-2">
						<Label
							htmlFor="dueDate"
							className="col-span-1 text-right mt-3"
						>
							Due Date
						</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"col-span-4 justify-start text-left font-normal",
										!formData.dueDate &&
											"text-muted-foreground"
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{formData.dueDate
										? format(formData.dueDate, "PPP")
										: "Pick a date"}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="w-auto p-0"
								align="start"
							>
								<Calendar
									mode="single"
									selected={formData.dueDate || undefined}
									onSelect={(date) =>
										setFormData((prev) => ({
											...prev,
											dueDate: date || null,
										}))
									}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</div>
					<div className="grid grid-cols-5 gap-2">
						<Label
							htmlFor="description"
							className="col-span-1 text-right mt-3"
						>
							Description
						</Label>
						<Textarea
							id="description"
							placeholder="Enter task description"
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							className="col-span-4"
						/>
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button>Cancel</Button>
					</DialogClose>
					<Button onClick={handleSave} disabled={editTask.isPending}>
						{editTask.isPending ? "Saving..." : "Save changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
