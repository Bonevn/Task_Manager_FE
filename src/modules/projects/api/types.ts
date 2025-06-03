import { ApiResponse } from "@/lib/api";

export interface User {
	id: string;
	email: string;
	name: string;
	phoneNumber: string | null;
	picture: string | null;
	bio: string | null;
	role?: "USER" | "ADMIN";
}
export interface Project {
	id: string;
	name: string;
	key: string;
	description: string;
	projectManagerId: string | null;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface CreateProjectRequest {
	name: string;
	description: string;
	key: string;
}

export interface ProjectProgress {
	projectId: string;
	projectKey: string;
	TODO: number;
	IN_PROGRESS: number;
	DONE: number;
}

export type EditProjectRequest = Project;

export type GetAllProjectsApiResponse = ApiResponse<Project[]>;
export type GetProjectByIdApiResponse = ApiResponse<Project>;
export type DeleteProjectApiResponse = ApiResponse<Project>;
export type CreateProjectApiResponse = ApiResponse<Project>;
export type EditProjectApiResponse = ApiResponse<Project>;
export type GetProjectProgressApiResponse = ApiResponse<ProjectProgress[]>;