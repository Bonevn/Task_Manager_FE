"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { universalFetcher, uploadFile } from "@/lib/api";
import type { GetAllTasksApiResponse, Task, GetTaskByIdApiResponse, EditTaskRequest, GetCommentsByTaskIdApiResponse, CreateCommentApiResponse, CreateCommentRequest, DeleteCommentApiResponse, DeleteTaskApiResponse, GetAllTaskActivitiesApiResponse, GetTaskOverviewApiResponse } from "./types";
import { useQueryClient } from "@tanstack/react-query";

export function useGetAllTasks() {
	return useQuery<GetAllTasksApiResponse, Error>({
		queryKey: ["tasks"],
		queryFn: () =>
			universalFetcher<null, GetAllTasksApiResponse>({
				url: "/api/tasks",
			}),
	});
}

export function useGetTasksByProjectId(projectId: string) {
	const queryResult = useQuery<GetAllTasksApiResponse, Error>({
		queryKey: ["tasks", projectId],
		queryFn: () =>
			universalFetcher<null, GetAllTasksApiResponse>({
				url: `/api/tasks?projectId=${projectId}`,
			}),
	});
	
	// Convert the tasks to a nested structure
	const nestedTasks = queryResult.data?.data.reduce((acc: Task[], task) => {
		if (task.parentId === null) {
			// This is a parent task
			const taskWithSubtasks = {
				...task,
				subtasks: queryResult.data.data.filter((t) => t.parentId === task.id),
			};
			acc.push(taskWithSubtasks);
		}
		return acc;
	}, []) ?? [];

	return {
		...queryResult,
		data: nestedTasks
	};
}

export function useGetTaskById(taskId: string) {
	return useQuery<GetTaskByIdApiResponse, Error>({
		queryKey: ["tasks", taskId],
		queryFn: () =>
			universalFetcher<null, GetTaskByIdApiResponse>({
				url: `/api/tasks/${taskId}`,
			}),
	});
}

export function useEditTask(taskId: string) {
	return useMutation<EditTaskRequest, Error, EditTaskRequest>({
		mutationFn: (task) =>
			universalFetcher<EditTaskRequest, EditTaskRequest>({
				url: `/api/tasks/${taskId}`,
				method: "PATCH",
				body: task,
			}),
	});
}

export function useCreateTask() {
	const queryClient = useQueryClient();
	return useMutation<Task, Error, Omit<Task, 'id' | 'sequence' | 'projectId' | 'status' | 'reporterId' | 'createdById' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'project' | 'assignee' | 'reporter' | 'subtasks' | 'comments'>>({
		mutationFn: (task) =>
			universalFetcher<typeof task, Task>({
				url: "/api/tasks",
				method: "POST",
				body: task,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});
}

export function useDeleteTask() {
	const queryClient = useQueryClient();
	return useMutation<DeleteTaskApiResponse, Error, string>({
		mutationFn: (taskId) =>
			universalFetcher<null, DeleteTaskApiResponse>({
				url: `/api/tasks/${taskId}`,
				method: "DELETE",
			}),
		onSuccess: () => {
			// Invalidate tasks query to trigger a refetch
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});
}

export function useGetCommentsByTaskId(taskId: string) {
	return useQuery<GetCommentsByTaskIdApiResponse, Error>({
		queryKey: ["comments", taskId],
		queryFn: () =>
			universalFetcher<null, GetCommentsByTaskIdApiResponse>({
				url: `/api/tasks/comments/${taskId}`,
			}),
	});
}

export function useCreateComment() {
	const queryClient = useQueryClient();
	return useMutation<CreateCommentApiResponse, Error, CreateCommentRequest>({
		mutationFn: (comment) =>
			universalFetcher<CreateCommentRequest, CreateCommentApiResponse>({
				url: "/api/tasks/comments",
				method: "POST",
				body: comment,
			}),
		onSuccess: () => {
			// Invalidate comments query to trigger a refetch
			queryClient.invalidateQueries({ queryKey: ["comments"] });
		},
	});
}

export function useDeleteComment() {
	const queryClient = useQueryClient();
	return useMutation<DeleteCommentApiResponse, Error, string>({
		mutationFn: (commentId) =>
			universalFetcher<null, DeleteCommentApiResponse>({
				url: `/api/tasks/comments/${commentId}`,
				method: "DELETE",
			}),
		onSuccess: () => {
			// Invalidate comments query to trigger a refetch
			queryClient.invalidateQueries({ queryKey: ["comments"] });
		},
	});
}

export function useGetAllTaskActivities() {
	return useQuery<GetAllTaskActivitiesApiResponse, Error>({
		queryKey: ["task-activities"],
		queryFn: () =>
			universalFetcher<null, GetAllTaskActivitiesApiResponse>({
				url: "/api/dashboard/activity",
			}),
	});
}

export function useGetTaskOverview() {
	return useQuery<GetTaskOverviewApiResponse, Error>({
		queryKey: ["task-overview"],
		queryFn: () =>
			universalFetcher<null, GetTaskOverviewApiResponse>({
				url: "/api/dashboard/pie-chart",
			}),
	});
}

export function useUploadFile() {
	const queryClient = useQueryClient();
	return useMutation<{ success: boolean }, Error, { file: File; taskId: string }>({
		mutationFn: async ({ file, taskId }) => {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('metadata', JSON.stringify({
				type: "TASK",
				description: "Task attachment",
				id: taskId
			}));

			return uploadFile<{ success: boolean }>({
				url: "/upload/file",
				formData,
			});
		},
		onSuccess: () => {
			// Invalidate tasks query to trigger a refetch
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});
}
