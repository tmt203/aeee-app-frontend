import type { ApiResponse } from "@type/api/api.type";
import type { Page, PageBody, PageQueryParams } from "@type/api/page.type";
import { apiGet, apiPut } from "@utils/api";

const PATH = "/api/v1/pages";

/**
 * Api get pages
 * @param params PageQueryParams
 * @param ssr boolean
 * @returns ApiResponse<Page[]>
 */
export const apiGetPages = async (params: PageQueryParams) => {
	return await apiGet<ApiResponse<Page[]>>({
		params,
		path: `${PATH}`,
		token: "AUTH_TOKEN"
	});
};

/**
 * Api get page by id
 * @param id string
 * @returns ApiResponseData<Page>
 */
export const apiGetPageById = async (id: string) => {
	return await apiGet<ApiResponse<Page>>({
		path: `${PATH}/${id}`,
		token: "AUTH_TOKEN"
	});
};

/**
 * Api put page by slug
 * @param body PageBody
 * @returns ApiResponseData<Page>
 */
export const apiPutPageBySlug = async (body: PageBody) => {
	return await apiPut<ApiResponse<Page>>({
		token: "AUTH_TOKEN",
		path: `${PATH}/slug`,
		body: JSON.stringify(body)
	});
};
