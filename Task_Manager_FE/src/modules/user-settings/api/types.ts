import { ApiResponse } from "@/lib/api";
import { User } from "@/modules/projects/api";

export interface UpdateUserRequest {
	name?: string;
	bio?: string | null;
	picture?: string | null;
	role?: "USER" | "ADMIN" | "PM" | "DEV" | "TESTER";
}

export interface ProjectUser {
	id: string;
	role: "OWNER" | "ADMIN" | "PM" | "DEV" | "TESTER" | "MEMBER";
	user: {
		id: string;
		name: string;
		email: string;
		picture: string | null;
	}
}

export interface ResetPasswordResponse {
	password: string;
}

export type GetProjectUsersApiResponse = ApiResponse<{ data: ProjectUser[] }>;

export type GetSelfApiResponse = User;
export type GetAllUsersApiResponse = ApiResponse<User[]>;
export type GetUserByIdApiResponse = ApiResponse<User>;
export type UpdateUserApiResponse = ApiResponse<User>;
export type ResetPasswordApiResponse = ApiResponse<ResetPasswordResponse>;
