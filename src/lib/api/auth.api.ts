import type { ApiResponse } from "@type/api/api.type";
import type { LoginBody, Register, RegisterBody, SessionData } from "@type/api/auth.type";
import { apiPost } from "@utils/api";

const PATH = "/api/v1/auth";

/**
 * Api post login
 * @param body LoginBody
 */
export const apiPostLogin = async (body: LoginBody) => {
	return await apiPost<ApiResponse<SessionData>>({
		token: "AUTH_TOKEN",
		path: `${PATH}/login`,
		body: JSON.stringify(body)
	});
};

/**
 * Api post register
 * @param body RegisterBody
 * @param token string
 * @returns
 */
export const apiPostRegister = async (body: RegisterBody) => {
	return await apiPost<ApiResponse<Register>>({
		token: "AUTH_TOKEN",
		path: `${PATH}/register`,
		body: JSON.stringify(body)
	});
};

/**
 * Api post verify token
 * @param token string
 */
export const apiPostVerifyToken = async (token: string) => {
	return await apiPost<ApiResponse<SessionData>>({
		token,
		path: `${PATH}/verify-token`
	});
};
