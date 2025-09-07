export type Request = {
	token: string;
	path: string;
	body?: BodyInit;
	params?: Record<string, unknown>;
	host?: string;
	apiKey?: string;
};

export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ApiResponse<T> = {
	code: string;
	message: string;
	total?: number;
	data: T;
};
