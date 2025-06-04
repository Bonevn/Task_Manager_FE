import { ApiResponse } from "@/lib/api";

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	name: string;
}

interface LoginResponse {
	access_token: string;
}

interface RegisterResponse extends String {}

export type LoginApiResponse = LoginResponse;
export type RegisterApiResponse = ApiResponse<RegisterResponse>;
