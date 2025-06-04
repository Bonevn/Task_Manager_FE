"use client";

import {
	X,
	ChevronUp,
	ChevronDown,
	Equal,
	SquareCheck,
	PlusIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTask } from "@/contexts/task-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import { Textarea } from "@/modules/ui/textarea";
import { Button } from "../ui/button";
import { useState } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbList,
} from "@/modules/ui/breadcrumb";
import { Task, TaskPriority, TaskStatus } from "@/modules/tasks/api/types";
import {
	useGetTaskById,
	useCreateTask,
	useGetCommentsByTaskId,
} from "@/modules/tasks/api/hooks";
import TaskCreateDialog from "../task-detail/components/task-create-dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUserById } from "../user-settings/api/hooks";
import { TaskFiles } from "../task-detail/components/task-files";
import { RoleBadge } from "../ui/role-badge";
import getImageUrl from "@/lib/get-image-url";
import TaskRelatedPeople from "@/modules/task-detail/task-related-people";

interface TaskDetailsSidebarProps {
	taskId: string;
	isOpen: boolean;
	onClose: () => void;
}

export function TaskDetailsSidebar({
	taskId,
	isOpen,
	onClose,
}: TaskDetailsSidebarProps) {
	const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
	const { data: task, isLoading } = useGetTaskById(taskId);
	const { data: comments, isLoading: isCommentsLoading } =
		useGetCommentsByTaskId(taskId);
	const reporterId = task?.data?.reporterId;
	const assigneeId = task?.data?.assigneeId;

	const { data: reporter, isLoading: isReporterLoading } = useGetUserById(
		reporterId ?? "",
		{
			enabled: Boolean(reporterId),
		}
	);
	const { data: assignee, isLoading: isAssigneeLoading } = useGetUserById(
		assigneeId ?? "",
		{
			enabled: Boolean(assigneeId),
		}
	);
	const createTask = useCreateTask();
	const queryClient = useQueryClient();

	const [descriptionValue, setDescriptionValue] = useState(
		task?.data?.description || ""
	);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	if (!isOpen || !taskId) {
		return null;
	}

	if (isLoading) {
		return (
			<div className="w-[400px] h-full bg-white border-l shadow-lg flex items-center justify-center">
				<span>Loading...</span>
			</div>
		);
	}

	const handleCancel = () => {
		setDescriptionValue(task?.data?.description || "");
		setIsDescriptionFocused(false);
	};

	const handleSave = () => {
		// TODO: Implement save functionality
		setIsDescriptionFocused(false);
	};

	const getStatusText = (status: TaskStatus) => {
		switch (status) {
			case TaskStatus.TODO:
				return "To Do";
			case TaskStatus.IN_PROGRESS:
				return "In Progress";
			case TaskStatus.DONE:
				return "Done";
			default:
				return status;
		}
	};

	const handleCreateTask = async (
		task: Omit<
			Task,
			| "id"
			| "sequence"
			| "projectId"
			| "status"
			| "reporterId"
			| "createdById"
			| "createdAt"
			| "updatedAt"
			| "deletedAt"
			| "project"
			| "assignee"
			| "reporter"
			| "subtasks"
			| "comments"
		>
	) => {
		try {
			await createTask.mutateAsync(task);
			toast.success("Task created successfully");
			queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
			setIsCreateDialogOpen(false);
		} catch (error) {
			toast.error("Failed to create task");
			console.error("Error creating task:", error);
		}
	};

	return (
		<div className="w-[400px] h-full bg-white border-l shadow-lg">
			<div className="flex flex-col h-full">
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-lg font-semibold">Task Details</h2>
					<button
						onClick={onClose}
						className="p-1 hover:bg-gray-100 rounded-full"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="flex-1 p-4 overflow-auto">
					<div className="space-y-6">
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink href={`/dashboard/kanban/${task?.data?.projectId}`}>
										{task?.data?.project.name}
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbLink
										href={`/dashboard/task/${task?.data?.id}`}
									>
										{task?.data?.name}
									</BreadcrumbLink>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
						<div>
							<h3 className="text-sm font-medium text-gray-500">
								Title
							</h3>
							<p className="mt-1 text-lg">{task?.data?.name}</p>
						</div>

						<div>
							<h3 className="text-sm font-medium text-gray-500">
								Status
							</h3>
							<p className="mt-1">
								{getStatusText(task?.data?.status as TaskStatus)}
							</p>
						</div>

						<div>
							<h3 className="text-sm font-medium text-gray-500">
								Details
							</h3>
							<div className="mt-2 space-y-2">
								<div className="flex items-center gap-2">
									<span>Type: </span>
									{task?.data?.parentId ? (
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
									<span>
										{task?.data?.parentId ? "Subtask" : "Task"}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span>Priority: </span>
									{task?.data?.priority ===
									TaskPriority.MEDIUM ? (
										<Equal
											className="h-4 w-4 text-yellow-500"
											strokeWidth={3}
										/>
									) : task?.data?.priority ===
									  TaskPriority.HIGH ? (
										<ChevronUp
											className="h-4 w-4 text-red-500"
											strokeWidth={3}
										/>
									) : task?.data?.priority ===
									  TaskPriority.LOW ? (
										<ChevronDown
											className="h-4 w-4 text-green-500"
											strokeWidth={3}
										/>
									) : null}
									<span>
										{task?.data?.priority
											? task?.data?.priority
													.charAt(0)
													.toUpperCase() +
											  task?.data?.priority.slice(1)
											: ""}
									</span>
								</div>
								<div>
									<span>
										Resolution:{" "}
										{task?.data?.status === TaskStatus.DONE
											? "Resolved"
											: "Unresolved"}
									</span>
								</div>
								<div>
									<span>
										Due Date:{" "}
										{task?.data?.dueDate 
											? new Date(task.data.dueDate).toLocaleDateString()
											: "No due date"}
									</span>
								</div>
							</div>
						</div>

						<div>
							<h3 className="text-sm font-medium text-gray-500">
								People
							</h3>
							<div className="mt-2 space-y-2">
								<div className="flex items-center gap-2">
									<span>Reporter: </span>
									<Avatar className="size-6">
										<AvatarImage
											src={getImageUrl(reporter?.data?.picture || "")}
										/>
										<AvatarFallback>
											{reporter?.data?.name
												.charAt(0)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<span>
										{reporter?.data?.name || "Unassigned"}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span>Assignee: </span>
									<Avatar className="size-6">
										<AvatarImage
											src={getImageUrl(assignee?.data?.picture || "")}
										/>
										<AvatarFallback>
											{assignee?.data?.name
												.charAt(0)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<span>
										{assignee?.data?.name || "Unassigned"}
									</span>
								</div>
								<a href="#" className="text-blue-500">
									Assign to me
								</a>
							</div>
						</div>

						<div className="flex flex-col">
							<TaskFiles attachments={task?.data?.attachments || []} taskId={taskId} />
						</div>

						<div className="flex flex-col gap-2">
							<h3 className="text-sm font-medium text-gray-500">
								Description
							</h3>
							<Textarea
								placeholder="Enter description"
								value={task?.data?.description}
								onChange={(e) =>
									setDescriptionValue(e.target.value)
								}
								readOnly={true}
								/* onFocus={() => setIsDescriptionFocused(true)} */
							/>
							{isDescriptionFocused && (
								<div className="flex flex-row items-end justify-end gap-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={handleCancel}
									>
										Cancel
									</Button>
									<Button
										variant="default"
										size="sm"
										onClick={handleSave}
									>
										Save
									</Button>
								</div>
							)}
						</div>

						{!task?.data?.parentId && (
							<div className="flex flex-col gap-2">
								<div className="flex flex-row items-center justify-between">
									<h3 className="text-sm font-medium text-gray-500">
										Subtasks
									</h3>
									<TaskCreateDialog
										buttonText=""
										buttonIcon={
											<PlusIcon
												className="h-4 w-4"
												strokeWidth={3}
											/>
										}
										variant="ghost"
										open={isCreateDialogOpen}
										onOpenChange={setIsCreateDialogOpen}
										parentId={taskId}
										projectId={task?.data?.projectId}
										onCreate={handleCreateTask}
									/>
								</div>
								<div className="mt-2 space-y-2">
									{task?.data?.subtasks?.length ? (
										task.data.subtasks.map(
											(subtask, index) => (
												<div
													key={index}
													className="flex flex-row items-center gap-2 justify-between"
												>
													<div className="flex flex-row items-center gap-2">
														<SquareCheck
															className="h-4 w-4 text-blue-500"
															strokeWidth={3}
														/>
														{subtask.priority ===
														TaskPriority.LOW ? (
															<ChevronDown
																className="h-4 w-4 text-green-500"
																strokeWidth={3}
															/>
														) : subtask.priority ===
														  TaskPriority.HIGH ? (
															<ChevronUp
																className="h-4 w-4 text-red-500"
																strokeWidth={3}
															/>
														) : (
															<Equal
																className="h-4 w-4 text-yellow-500"
																strokeWidth={3}
															/>
														)}
														<a
															href={`/dashboard/task/${subtask.id}`}
															className="text-blue-500 hover:underline"
														>
															{subtask.name}
														</a>
													</div>
													<p>
														{subtask.status ===
														TaskStatus.TODO
															? "To Do"
															: subtask.status ===
															  TaskStatus.IN_PROGRESS
															? "In Progress"
															: "Done"}
													</p>
												</div>
											)
										)
									) : (
										<p className="text-gray-500">No subtask</p>
									)}
								</div>
							</div>
						)}

						<div>
							<h3 className="text-sm font-medium text-gray-500">
								Comments
							</h3>
							<div className="mt-2 space-y-4">
								{comments?.data?.length ? (
									comments.data.map((comment, index) => (
										<div key={index} className="flex gap-2">
											<Avatar className="size-6">
												<AvatarImage
													src={
														getImageUrl(comment.user?.picture || "")
													}
												/>
												<AvatarFallback>
													{comment.user?.name
														.charAt(0)
														.toUpperCase()}
						   						</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<span className="font-medium">
														{comment.user?.name}
													</span>
													<RoleBadge role={comment.user?.role || "USER"} />
													<span className="text-sm text-gray-500">
														{new Date(
															comment.createdAt
														).toLocaleString()}
													</span>
												</div>
												<p className="mt-1">
													{comment.content}
												</p>
											</div>
										</div>
									))
								) : (
									<p className="text-gray-500">No comment yet.</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
