import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => {
	const session = locals.session.data;
	return {
		session
	};
};
