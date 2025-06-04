"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { universalFetcher, uploadFile } from "@/lib/api";
import type { GetAllUsersApiResponse, GetProjectUsersApiResponse, GetSelfApiResponse, GetUserByIdApiResponse, ResetPasswordApiResponse, UpdateUserApiResponse, UpdateUserRequest } from "./types";
import type { User } from "@/modules/projects/api/types";
import { ProjectUser } from "./types";

export function useGetSelf() {
	return useQuery<GetSelfApiResponse, Error>({
		queryKey: ["users", "self"],
		queryFn: () =>
			universalFetcher<null, GetSelfApiResponse>({
				url: "/api/auth/me",
			}),
	});
}

export function useGetAllUsers() {
	return useQuery<GetAllUsersApiResponse, Error>({
		queryKey: ["users"],
		queryFn: () =>
			universalFetcher<null, GetAllUsersApiResponse>({
				url: "/api/users",
			}),
	});
}

export function useGetUserById(userId: string, options?: { enabled?: boolean }) {
	return useQuery<GetUserByIdApiResponse, Error>({
		queryKey: ["users", userId],
		queryFn: async () => {
			const response = await universalFetcher<null, GetAllUsersApiResponse>({
				url: "/api/users",
			});
			const user = response.data.find((user: User) => user.id === userId);
			if (!user) {
				throw new Error("User not found");
			}
			return { data: user, message: "User found", statusCode: 200 };
		},
		enabled: options?.enabled ?? true,
	});
}

export function useUpdateUser(userId: string) {
	const queryClient = useQueryClient();
	return useMutation<UpdateUserApiResponse, Error, UpdateUserRequest>({
		mutationFn: (data) =>
			universalFetcher<UpdateUserRequest, UpdateUserApiResponse>({
				url: `/api/users/${userId}`,
				method: "PATCH",
				body: data,
			}).then((res) => {
				queryClient.invalidateQueries({ queryKey: ["users"] });
				return res;
			}),
	});
}

export function useUpdateSelf() {
	return useMutation<UpdateUserApiResponse, Error, UpdateUserRequest>({
		mutationFn: (data) =>
			universalFetcher<UpdateUserRequest, UpdateUserApiResponse>({
				url: `/api/users/profile`,
				method: "PATCH",
				body: data,
			}),
	});
}

export function useResetPassword(userId: string) {
	return useMutation<ResetPasswordApiResponse, Error>({
		mutationFn: () =>
			universalFetcher<null, ResetPasswordApiResponse>({
				url: `/api/users/reset-password/${userId}`,
				method: "PATCH",
			}),
	});
}

export function useGetProjectUsers(projectId: string) {
	return useQuery<GetProjectUsersApiResponse, Error>({
		queryKey: ["project-users", projectId],
		queryFn: () =>
			universalFetcher<null, GetProjectUsersApiResponse>({
				url: `/api/projects/${projectId}/user`,
			}),
	});
}

export function useAddProjectUser(projectId: string, userId: string) {
	return useMutation<UpdateUserApiResponse, Error, ProjectUser["role"]>({
		mutationFn: (data) =>
			universalFetcher<{ role: ProjectUser["role"] }, UpdateUserApiResponse>({
				url: `/api/projects/${projectId}/user/${userId}`,
				method: "POST",
				body: { role: data },
			}),
	});
}

export function useUpdateProjectUser(projectId: string, userId: string) {
	return useMutation<UpdateUserApiResponse, Error, ProjectUser["role"]>({
		mutationFn: (data) =>
			universalFetcher<{ role: ProjectUser["role"] }, UpdateUserApiResponse>({
				url: `/api/projects/${projectId}/user/${userId}`,
				method: "PATCH",
				body: { role: data },
			}),
	});
}

export function useDeleteProjectUser(projectId: string, userId: string) {
	return useMutation<UpdateUserApiResponse, Error>({
		mutationFn: () =>
			universalFetcher<null, UpdateUserApiResponse>({
				url: `/api/projects/${projectId}/user/${userId}`,
				method: "DELETE",
			}),
	});
}

export function useUploadUserImage() {
	const queryClient = useQueryClient();
	return useMutation<{ success: boolean; data: {url: string} }, Error, { file: File; userId: string }>({
		mutationFn: async ({ file, userId }) => {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('metadata', JSON.stringify({
				type: "USER",
				description: "User Image",
				id: userId
			}));

			const response = await uploadFile<{ success: boolean; data: { url: string } }>({
				url: "/upload/file",
				formData,
			});

			// Extract the URL from the response and encode it
			const encodedUrl = encodeURIComponent(response.data.url);
			const fullImageUrl = `http://localhost:38989/upload/image/${encodedUrl}`;

			// Update the user's picture field
			await universalFetcher<{ picture: string }, UpdateUserApiResponse>({
				url: `/api/users/${userId}`,
				method: "PATCH",
				body: { picture: fullImageUrl },
			});

			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users", "self"] });
		},
	});
}