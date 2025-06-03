import { ApiResponse } from "@/lib/api";
import { Project, User } from "@/modules/projects/api/types";

export enum TaskStatus {
	TODO = "TODO",
	IN_PROGRESS = "IN_PROGRESS",
	DONE = "DONE"
}

export enum TaskPriority {
	LOW = "LOW",
	MEDIUM = "MEDIUM",
	HIGH = "HIGH"
}

export interface Attachment {
	id: string;
	name: string;
	url: string;
	createdAt: string;
}

export interface Comment {
	id: string;
	content: string;
	userId: string;
	user?: User;
	taskId: string;
	createdAt: string;
	updatedAt: string;
}

export interface Task {
	id: string;
	name: string;
	description: string;
	sequence: number;
	projectId: string;
	parentId: string | null;
	status: TaskStatus;
	resolution?: string;
	priority: TaskPriority;
	dueDate: string | null;
	selected: boolean;
	assigneeId: string | null;
	reporterId: string | null;
	createdById: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	project: Project;
	assignee?: User | null;
	reporter?: User | null;
	subtasks?: Task[];
	comments?: Comment[];
	attachments?: Attachment[];
}

export interface TaskActivity {
	id: string;
	userId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	user?: User;
}

export interface CreateCommentRequest {
	content: string;
	taskId: string;
}
export interface TaskOverview {
	TODO: number;
	IN_PROGRESS: number;
	DONE: number;
}

export type EditTaskRequest = Partial<Task>;

export type GetAllTasksApiResponse = ApiResponse<Task[]>;
export type GetTaskByIdApiResponse = ApiResponse<Task>;
export type GetCommentsByTaskIdApiResponse = ApiResponse<Comment[]>;
export type CreateCommentApiResponse = ApiResponse<Comment>;
export type DeleteCommentApiResponse = ApiResponse<Comment>;
export type DeleteTaskApiResponse = ApiResponse<Task>;
export type GetAllTaskActivitiesApiResponse = ApiResponse<TaskActivity[]>;
export type GetTaskOverviewApiResponse = ApiResponse<TaskOverview>;