import { apiGetIssues } from "@api/issue.api";
import type { Issue } from "@type/api/issue.type";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
	let issue: Issue | null = null;

	// Get query parameters and convert to numbers
	const volume = url.searchParams.get("volume") ?? undefined;
	const issueNumber = url.searchParams.get("issue") ?? undefined;

	// Convert to numbers
	const volumeNum = volume ? +volume : undefined;
	const issueNumberNum = issueNumber ? +issueNumber : undefined;

	try {
		if (volumeNum && issueNumberNum) {
			const response = await apiGetIssues({
				volume: volumeNum,
				issue: issueNumberNum,
				manager__active_eq: true,
				limit: 1
			});
			issue = response.data[0] ?? null;
		} else {
			const response = await apiGetIssues({
				manager__active_eq: true,
				sort: "-volume,-issue",
				limit: 1
			});
			issue = response.data[0] ?? null;
			return { issue };
		}
	} catch (error) {
		console.log(error);
	}

	return { issue };
};
