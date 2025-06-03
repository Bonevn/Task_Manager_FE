"use client";
import TaskDetailHeader from "./components/task-detail-header";
import ActionButtonGroup from "./components/action-button-group";
import TaskBasicDetails from "./task-basic-details";
import TaskRelatedPeople from "./task-related-people";
import TaskDescription from "./task-description";
import TaskComments from "./task-comments";
import { useGetTaskById, useGetCommentsByTaskId, TaskStatus } from "@/modules/tasks/api";
import { useGetUserById } from "@/modules/user-settings/api/hooks";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import TaskDeleteDialog from "./components/task-delete-dialog";
import { TaskFiles } from "./components/task-files";
interface TaskDetailProps {
	taskId: string;
}

export default function TaskDetail({ taskId }: TaskDetailProps) {
	const commentInputRef = useRef<HTMLInputElement>(null);
	const { data: task, isLoading } = useGetTaskById(taskId);
	const { data: comments, isLoading: isCommentsLoading } = useGetCommentsByTaskId(taskId);
	const reporterId = task?.data?.reporterId;
	const assigneeId = task?.data?.assigneeId;
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const { data: reporter, isLoading: isReporterLoading } = useGetUserById(reporterId ?? "", {
		enabled: Boolean(reporterId)
	});
	const { data: assignee, isLoading: isAssigneeLoading } = useGetUserById(assigneeId ?? "", {
		enabled: Boolean(assigneeId)
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (!task) {
		return null;
	}

	return (
		<div className="flex flex-col gap-8">
			<TaskDetailHeader
				taskDescription={task?.data?.name}
				projectName={task?.data?.project.name}
				projectId={task?.data?.projectId}
			/>
			<ActionButtonGroup
				commentInputRef={commentInputRef}
				taskId={taskId}
			/>
			<div className="grid grid-cols-2 gap-8">
				<TaskBasicDetails
					priority={task?.data?.priority}
					resolution={task?.data?.status === TaskStatus.DONE ? "Resolved" : "Unresolved"}
					parentId={task?.data?.parentId!}
					status={task?.data?.status!}
					dueDate={task?.data?.dueDate || ""}
				/>
				<TaskRelatedPeople
					reporter={reporter?.data || {
						id: "unknown",
						name: "Unknown User",
						email: "",
						phoneNumber: null,
						picture: null,
						bio: null
					}}
					assignee={assignee?.data || {
						id: "unknown",
						name: "Unknown User",
						email: "",
						phoneNumber: null,
						picture: null,
						bio: null
					}}
					taskId={taskId}
				/>
			</div>
			<div className="flex flex-col gap-8 w-2/3">
				<TaskDescription description={task?.data?.description || ""} />
				<TaskComments
					ref={commentInputRef}
					comments={comments?.data || []}
					taskId={taskId}
				/>
				<TaskFiles attachments={task?.data?.attachments || []} taskId={taskId} />
			</div>
			<Button variant="destructive" className="text-white mr-auto" onClick={() => setDeleteDialogOpen(true)}>Delete Task</Button>
			<TaskDeleteDialog
				taskId={taskId}
				projectId={task?.data?.projectId || ""}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			/>
		</div>
	);
}
