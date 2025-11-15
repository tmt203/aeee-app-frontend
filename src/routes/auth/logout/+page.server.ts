import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
	await locals.session.destroy();

	// Get query params (if any)
	const error = url.searchParams.get("error");

	if (error === "session_expired") {
		throw redirect(303, "/auth/signin?error=session_expired");
	}

	throw redirect(303, "/auth/signin");
};
