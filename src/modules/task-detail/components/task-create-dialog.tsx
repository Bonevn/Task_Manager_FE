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
import { useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/modules/tasks/api/types";
import { useGetAllUsers } from "@/modules/user-settings/api/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import { UserSelect } from "@/modules/ui/user-select";

interface TaskCreateDialogProps {
	buttonText: string;
	buttonIcon: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	parentId?: string | null;
	projectId?: string;
	onCreate: (task: Omit<Task, 'id' | 'sequence' | 'status' | 'reporterId' | 'createdById' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'project' | 'assignee' | 'reporter' | 'subtasks' | 'comments'>) => void;
	variant?: "default" | "ghost";
}

export default function TaskCreateDialog({
	buttonText,
	buttonIcon,
	open,
	onOpenChange,
	parentId,
	projectId,
	onCreate,
	variant = "default",
}: TaskCreateDialogProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
	const [assigneeId, setAssigneeId] = useState<string | null>(null);
	const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
	const { data: users } = useGetAllUsers();

	const handleCreate = () => {
		onCreate({
			name,
			description,
			priority,
			assigneeId,
			dueDate: dueDate?.toISOString() || null,
			parentId: parentId ?? null,
			selected: false,
			projectId: projectId || "",
		});
		// Reset form
		setName("");
		setDescription("");
		setPriority(TaskPriority.MEDIUM);
		setAssigneeId(null);
		setDueDate(undefined);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button variant={variant}>
					{buttonIcon}
					{buttonText}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Task</DialogTitle>
					<DialogDescription>Add a new task to the project</DialogDescription>
				</DialogHeader>
				<div className="grid gap-2">
					<div className="grid grid-cols-5 gap-2">
						<Label htmlFor="name" className="col-span-1 text-right mt-3">Name</Label>
						<Input
							id="name"
							placeholder="Enter task name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="col-span-4"
						/>
					</div>
					<div className="grid grid-cols-5 gap-2">
						<Label htmlFor="priority" className="col-span-1 text-right mt-3">Priority</Label>
						<Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
							<SelectTrigger className="col-span-4">
								<SelectValue placeholder="Select priority" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={TaskPriority.LOW}>Low</SelectItem>
								<SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
								<SelectItem value={TaskPriority.HIGH}>High</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-5 gap-2">
						<Label htmlFor="assignee" className="col-span-1 text-right mt-3">Assignee</Label>
						<UserSelect
							value={assigneeId}
							onValueChange={setAssigneeId}
							placeholder="Select assignee"
							className="col-span-4"
						/>
					</div>
					<div className="grid grid-cols-5 gap-2">
						<Label htmlFor="dueDate" className="col-span-1 text-right mt-3">Due Date</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"col-span-4 justify-start text-left font-normal",
										!dueDate && "text-muted-foreground"
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{dueDate ? format(dueDate, "PPP") : "Pick a date"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={dueDate}
									onSelect={setDueDate}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</div>
					<div className="grid grid-cols-5 gap-2">
						<Label htmlFor="description" className="col-span-1 text-right mt-3">Description</Label>
						<Textarea
							id="description"
							placeholder="Enter task description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="col-span-4"
						/>
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button onClick={handleCreate}>Create Task</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
} 