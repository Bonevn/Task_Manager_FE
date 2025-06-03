"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { universalFetcher } from "@/lib/api";
import type { CreateProjectApiResponse, CreateProjectRequest, DeleteProjectApiResponse, EditProjectApiResponse, EditProjectRequest, GetAllProjectsApiResponse, GetProjectByIdApiResponse, GetProjectProgressApiResponse } from "./types";

export function useGetAllProjects() {
	return useQuery<GetAllProjectsApiResponse, Error>({
		queryKey: ["projects"],
		queryFn: () =>
			universalFetcher<null, GetAllProjectsApiResponse>({
				url: "/api/projects",
			}),
	});
}

export function useGetProjectById(projectId: string) {
	return useQuery<GetProjectByIdApiResponse, Error>({
		queryKey: ["projects", projectId],
		queryFn: () =>
			universalFetcher<null, GetProjectByIdApiResponse>({
				url: `/api/projects/${projectId}`,
			}),
	});
}

export function useCreateProject() {
	const queryClient = useQueryClient();
	return useMutation<CreateProjectApiResponse, Error, CreateProjectRequest>({
		mutationFn: (project) =>
			universalFetcher<CreateProjectRequest, CreateProjectApiResponse>({
				url: "/api/projects",
				method: "POST",
				body: project,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
	});
}

export function useEditProject() {
	const queryClient = useQueryClient();
	return useMutation<EditProjectApiResponse, Error, EditProjectRequest>({
		mutationFn: (project) =>
			universalFetcher<EditProjectRequest, EditProjectApiResponse>({
				url: `/api/projects/${project.id}`,
				method: "PATCH",
				body: project,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
	});
}

export function useDeleteProject() {
	const queryClient = useQueryClient();
	return useMutation<DeleteProjectApiResponse, Error, string>({
		mutationFn: (projectId) =>
			universalFetcher<null, DeleteProjectApiResponse>({
				url: `/api/projects/${projectId}`,
				method: "DELETE",
			}),
		onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
	});
}

export function useGetProjectProgress() {
	return useQuery<GetProjectProgressApiResponse, Error>({
		queryKey: ["project-progress"],
		queryFn: () =>
			universalFetcher<null, GetProjectProgressApiResponse>({
				url: "/api/dashboard/count-task-by-project",
			}),
	});
}