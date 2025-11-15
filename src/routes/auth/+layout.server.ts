import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    const session = locals.session.data;

    // If there is a session, redirect to the admin page
    if (session?.id) {
        throw redirect(303, "/admin");
    }

    return {
        session
    };
};
