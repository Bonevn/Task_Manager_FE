"use client";

import { useMutation } from "@tanstack/react-query";
import { universalFetcher } from "@/lib/api";
import type {
	LoginRequest,
	LoginApiResponse,
	RegisterRequest,
	RegisterApiResponse,
} from "./types";

export function useLoginMutation() {
	return useMutation<LoginApiResponse, Error, LoginRequest>({
		mutationFn: (credentials) =>
			universalFetcher<LoginRequest, LoginApiResponse>({
				url: "/api/auth/login",
				method: "POST",
				body: credentials,
			}),
	});
}

export function useRegisterMutation() {
	return useMutation<RegisterApiResponse, Error, RegisterRequest>({
		mutationFn: (credentials) =>
			universalFetcher<RegisterRequest, RegisterApiResponse>({
				url: "/api/auth/register",
				method: "POST",
				body: credentials,
			}),
	});
}
