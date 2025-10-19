import type { ApiResponse } from "@type/api/api.type";
import type { Issue, IssueQueryParams } from "@type/api/issue.type";
import { apiGet } from "@utils/api";

const PATH = "/api/v1/issues";

/**
 * Api get issues
 * @param params IssueQueryParams
 * @returns ApiResponse<Issue[]>
 */
export const apiGetIssues = async (params: IssueQueryParams) => {
	return await apiGet<ApiResponse<Issue[]>>({
		path: `${PATH}`,
		token: "AUTH_TOKEN",
		params
	});
};

/**
 * Api get latest issue
 * @returns ApiResponse<Issue>
 */
export const apiGetLatestIssue = async () => {
	return await apiGet<ApiResponse<Issue>>({
		path: `${PATH}/latest`,
		token: "AUTH_TOKEN"
	});
};
