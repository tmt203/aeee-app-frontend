import { apiGetLatestIssue } from "@api/issue.api";
import type { Issue } from "@type/api/issue.type";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	let issue: Issue | null = null;

	try {
		const response = await apiGetLatestIssue();

		issue = response.data ?? null;

		return { issue };
	} catch (error) {
		console.log(error);
	}

	return { issue };
};
