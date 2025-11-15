import { apiPostLogin } from "@api/auth.api.js";
import type { LoginBody, SessionData } from "@type/api/auth.type.js";
import type { AppServerResponse } from "@type/app-server";

export const actions = {
	login: async ({ cookies, request, locals }): Promise<AppServerResponse> => {
		const formData = await request.formData();
		const loginBody: LoginBody = {
			identifier: formData.get("identifier") as string,
			password: formData.get("password") as string
		};

		try {
			const response = await apiPostLogin(loginBody);

			if (response.code !== "OK") {
				return {
					code: response.code,
					message: response.message || "Login failed. Please try again."
				};
			}

			const session: SessionData = {
				...response.data,
				token: response.token || ""
			};

			// Set session cookie
			await locals.session.set(session);

			return { code: "OK" };
		} catch (error) {
			return {
				code: "ERR_UNKNOWN",
				message: "Login failed. Please check your credentials and try again."
			};
		}
	}
};
