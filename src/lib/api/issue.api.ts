import type { ApiResponse } from "@type/api/api.type";
import type { Issue, IssueQueryParams, PublishIssueBody } from "@type/api/issue.type";
import { apiGet, apiPost } from "@utils/api";

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
 * Api post publish issue
 * @param body PublishIssueBody
 * @param token string
 * @returns ApiResponse<Issue>
 */
export const apiPostPublishIssue = async (body: PublishIssueBody, token: string) => {
	return await apiPost<ApiResponse<Issue>>({
		token,
		body: JSON.stringify(body),
		path: `${PATH}/publish-issue`
	});
};
