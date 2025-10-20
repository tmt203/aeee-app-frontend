import { API_HOST } from "$lib/env/client";
import type { ApiMethod, Request } from "@type/api/api.type";
import queryString from "query-string";

/**
 * Handle get request's headers
 * @param token string
 * @param apiKey string
 * @param locale string
 */
const getAuthHeaders = (token?: string, apiKey?: string) => {
	if (!token && !apiKey) throw new Error("No authentication provided");

	const headers: Record<string, string> = {
		"Content-Type": "application/json"
	};

	if (apiKey) {
		headers["x-api-key"] = apiKey;
	} else if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	return headers;
};

/**
 * Api request
 * @param method ApiMethod
 * @param request Request
 */
const apiRequest = async <T>(method: ApiMethod, request: Request) => {
	const { path, body, params, token, apiKey, host } = request;
	const headers = getAuthHeaders(token, apiKey);

	const queryParam =
		params && Object.keys(params).length > 0 ? "?" + queryString.stringify(params) : "";

	const baseUrl = host ?? API_HOST ?? "";
	const finalUrl = `${baseUrl}${path}${queryParam}`;

	const options: RequestInit = {
		method,
		headers,
		body
	};

	const response = await fetch(finalUrl, options);
	return response.json() as T;
};

/**
 * Api get data
 * @param token string
 * @param path string
 * @param params Record<string, unknown>
 * @returns Generic Type <T>
 */
export const apiGet = <T>(request: Request) => {
	return apiRequest<T>("GET", { ...request });
};

/**
 * Api post data
 * @param token string
 * @param path string
 * @param body Record<string, unknown>
 * @param params Record<string, unknown>
 * @returns Generic Type <T>
 */
export async function apiPost<T>(request: Request) {
	return apiRequest<T>("POST", request);
}

/**
 * Api update data
 * @param token string
 * @param path string
 * @param body Record<string, unknown>
 * @param params Record<string, unknown>
 * @returns Generic Type <T>
 */
export async function apiPut<T>(request: Request) {
	return apiRequest<T>("PUT", request);
}

/**
 * Api delete data
 * @param token string
 * @param path string
 * @param params Record<string, unknown>
 * @returns Generic Type <T>
 */
export async function apiDelete<T>(request: Request) {
	return apiRequest<T>("DELETE", request);
}

/**
 * Api delete data
 * @param token string
 * @param path string
 * @param params Record<string, unknown>
 * @returns Generic Type <T>
 */
export async function apiPatch<T>(request: Request) {
	return apiRequest<T>("PATCH", request);
}

/**
 * Api Get File
 * @param request Request
 * @returns Response
 */
export const apiGetFile = async (request: Request) => {
	const { path, body, params, token, apiKey } = request;

	const headers = getAuthHeaders(token, apiKey);
	const queryParam =
		JSON.stringify(params) !== "{}" ? "?" + queryString.stringify(params ?? {}) : "";

	const finalUrl = `${API_HOST}${path}${queryParam}`;
	const options: RequestInit = {
		method: "GET",
		headers,
		body
	};

	const response = await fetch(finalUrl, options);
	return response;
};

/**
 * Api post file
 * @param request Request
 * @returns Generic Type <T>
 */
export async function apiPostFile<T>(request: Request) {
	const { path, body, params, token } = request;
	const headers = {
		Authorization: `Bearer ${token}`
	};
	const queryParam =
		params && JSON.stringify(params) !== "{}" ? "?" + queryString.stringify(params ?? {}) : "";

	const finalUrl = `${API_HOST}${path}${queryParam}`;
	const options: RequestInit = {
		method: "POST",
		headers,
		body
	};

	const response = await fetch(finalUrl, options);
	return response.json() as T;
}
