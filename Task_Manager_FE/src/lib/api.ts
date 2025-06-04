export interface ApiResponse<T> {
	data: T;
	message: string;
	statusCode: number;
}

interface FetcherParams<Req> {
	url: string;
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	body?: Req;
	queryParams?: Record<string, any>;
	headers?: Record<string, string>;
	skipAuth?: boolean;
}

export async function universalFetcher<Req, Res>({
	url,
	method = "GET",
	body,
	queryParams,
	headers = {},
	skipAuth = false,
}: FetcherParams<Req>): Promise<Res> {
	let fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`;

	if (queryParams && method === "GET") {
		const queryString = new URLSearchParams(queryParams).toString();
		fullUrl += `?${queryString}`;
	}

	const token = !skipAuth && typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

	const options: RequestInit = {
		method,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...headers,
		},
	};

	if (body && method !== "GET") {
		options.body = JSON.stringify(body);
	}

	const response = await fetch(fullUrl, options);
	const json = await response.json();

	if (!response.ok) {
		const error: any = new Error(json.message || "Request failed");
		error.status = response.status;
		throw error;
	}

	return json;
}

export async function uploadFile<Res>({
	url,
	formData,
	skipAuth = false,
}: {
	url: string;
	formData: FormData;
	skipAuth?: boolean;
}): Promise<Res> {
	const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`;
	const token = !skipAuth && typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

	const response = await fetch(fullUrl, {
		method: "POST",
		body: formData,
		headers: {
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	});

	const json = await response.json();

	if (!response.ok) {
		const error: any = new Error(json.message || "Upload failed");
		error.status = response.status;
		throw error;
	}

	return json;
}
