"use client";
import { Button } from "@/modules/ui/button";
import {
	Pencil,
	Trash,
	MessageCircle,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/modules/ui/dropdownmenu";
import TaskEditDialog from "./task-edit-dialog";
import { useState, RefObject } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import { useGetAllUsers } from "@/modules/user-settings/api";
import { useEditTask } from "@/modules/tasks/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGetTaskById } from "@/modules/tasks/api/hooks";
import { TaskStatus } from "@/modules/tasks/api/types";

interface ActionButtonGroupProps {
    commentInputRef: RefObject<HTMLInputElement | null>;
	taskId: string;
}

const users = [
    {
        avatar: "https://github.com/shadcn.png",
        name: "Thanh Do",
    },
    {
        avatar: "https://github.com/nextui-org.png",
        name: "Viet Anh Nguyen",
    },
    {
        avatar: "https://github.com/vercel.png",
        name: "John Doe",
    }
];

export default function ActionButtonGroup({ commentInputRef, taskId }: ActionButtonGroupProps) {
	const [open, setOpen] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);
	const { data: users } = useGetAllUsers();
    const { data: task } = useGetTaskById(taskId);
    const { mutate: editTask } = useEditTask(taskId);
    const queryClient = useQueryClient();

    const handleCommentClick = () => {
        commentInputRef.current?.focus();
    };

    const handleAssign = (userId: string) => {
        editTask(
            { assigneeId: userId },
            {
                onSuccess: () => {
                    toast.success("Task assigned successfully");
                    queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
                    setAssignOpen(false);
                },
                onError: (error) => {
                    toast.error("Failed to assign task: " + error.message);
                },
            }
        );
    };

    const handleStatusChange = (status: TaskStatus) => {
        editTask(
            { status },
            {
                onSuccess: () => {
                    toast.success("Task status updated successfully");
                    queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
                    setOpen(false);
                },
                onError: (error) => {
                    toast.error("Failed to update task status: " + error.message);
                },
            }
        );
    };

	return (
		<div className="flex flex-row gap-3">
			<Button variant="secondary" onClick={() => setOpenEditDialog(true)}>
				<Pencil />
				Edit
			</Button>
			<Button variant="secondary" onClick={handleCommentClick}>
				<MessageCircle />
				Comment
			</Button>
			<DropdownMenu open={assignOpen} onOpenChange={setAssignOpen}>
				<DropdownMenuTrigger asChild>
					<Button variant="secondary">
						Assign
						{assignOpen ? (
							<ChevronUp className="ml-1 w-4 h-4" />
						) : (
							<ChevronDown className="ml-1 w-4 h-4" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{users?.data.map((user) => (
						<DropdownMenuItem 
                            key={user.id} 
                            className="flex items-center gap-2"
                            onClick={() => handleAssign(user.id)}
                        >
							<Avatar className="size-6">
								<AvatarImage src={user.picture || ""} />
								<AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
							</Avatar>
							<span>{user.name}</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<Button variant="default">
						{task?.data?.status ? task.data.status.charAt(0) + task.data.status.slice(1).toLowerCase() : "In Progress"}
						{open ? (
							<ChevronUp className="ml-1 w-4 h-4" />
						) : (
							<ChevronDown className="ml-1 w-4 h-4" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => handleStatusChange(TaskStatus.TODO)}>To Do</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}>In Progress</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleStatusChange(TaskStatus.DONE)}>Done</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<TaskEditDialog
				buttonText="Edit"
				buttonIcon={<Pencil />}
				taskId={taskId}
				name="Edit Task"
				description="Edit task details"
				type="Task"
				priority="Medium"
				assignee={task?.data?.assignee?.name || "Unassigned"}
				reporter={task?.data?.reporter?.name || "Unassigned"}
				onOpen={() => setOpenEditDialog(true)}
				open={openEditDialog}
				onOpenChange={setOpenEditDialog}
			/>
		</div>
	);
}
