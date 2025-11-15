import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "../$types";
import { apiPostVerifyToken } from "@api/auth.api";

export const load: LayoutServerLoad = async ({ locals }) => {
	let session = locals.session.data;

	// If there's no session, redirect to the login page
	if (!session?.id) {
		throw redirect(303, "/auth/signin");
	}

	try {
		const response = await apiPostVerifyToken(session.token);

		if (response.code !== "OK") {
			// Clear the session and redirect to login if the token is invalid
			await locals.session.destroy();

			let errorCode: string = "";

			if (response.code === "ERR_JWT_INVALID") {
				errorCode = "invalid_token";
			} else if (response.code === "ERR_JWT_EXPIRED") {
				errorCode = "token_expired";
			}

			errorCode = errorCode ? `error=${errorCode}` : "";
			throw redirect(303, `/auth/signin?${errorCode}`);
		}

		// If the token is valid, return the session data
		session = response.data;
	} catch (error) {
		// Clear the session and redirect to login if the token is invalid
		await locals.session.destroy();
		throw redirect(303, "/auth/signin");
	}

	return {
		session
	};
};
