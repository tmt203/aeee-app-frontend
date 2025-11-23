import type { ApiResponse } from "@type/api/api.type";
import type {
	EarlyAccessArticle,
	EarlyAccessArticleBody,
	EarlyAccessArticleQueryParams,
	UploadFile,
	UploadFileQueryParams
} from "@type/api/early_access_article.type";
import { apiDelete, apiGet, apiPatch, apiPost, apiPostFile, apiPut } from "@utils/api";

const PATH = "/api/v1/early-access-articles";

/**
 * Api get early access articles
 * @param params EarlyAccessArticleQueryParams
 * @returns ApiResponse<EarlyAccessArticle[]>
 */
export const apiGetEarlyAccessArticles = async (params: EarlyAccessArticleQueryParams) => {
	return await apiGet<ApiResponse<EarlyAccessArticle[]>>({
		params,
		path: `${PATH}`,
		token: "AUTH_TOKEN"
	});
};

/**
 * Api get early access article by id
 * @param id string
 * @returns ApiResponse<EarlyAccessArticle>
 */
export const apiGetEarlyAccessArticleById = async (id: string) => {
	return await apiGet<ApiResponse<EarlyAccessArticle>>({
		token: "AUTH_TOKEN",
		path: `${PATH}/${id}`
	});
};

/**
 * Api update early access article by id
 * @param id string
 * @param body EarlyAccessArticleBody
 * @param token string
 * @returns ApiResponse<EarlyAccessArticle>
 */
export const apiUpdateEarlyAccessArticleById = async (
	id: string,
	body: EarlyAccessArticleBody,
	token: string
) => {
	return await apiPut<ApiResponse<EarlyAccessArticle>>({
		token,
		path: `${PATH}/${id}`,
		body: JSON.stringify(body)
	});
};

/**
 * Api post early access article
 * @param body EarlyAccessArticleBody
 * @returns ApiResponse<EarlyAccessArticle>
 */
export const apiPostEarlyAccessArticle = async (body: EarlyAccessArticleBody, token: string) => {
	return await apiPost<ApiResponse<EarlyAccessArticle>>({
		token,
		path: `${PATH}`,
		body: JSON.stringify(body)
	});
};

/**
 * Api patch early access article by id
 * @param id string
 * @param body Partial<EarlyAccessArticleBody>
 * @param token string
 * @returns ApiResponse<EarlyAccessArticle>
 */
export const apiPatchEarlyAccessArticleById = async (
	id: string,
	body: Partial<EarlyAccessArticleBody>,
	token: string
) => {
	return await apiPatch<ApiResponse<EarlyAccessArticle>>({
		token,
		path: `${PATH}/${id}`,
		body: JSON.stringify(body)
	});
};

/**
 * Api delete early access article by id
 * @param id string
 * @param token string
 * @returns ApiResponse<null>
 */
export const apiDeleteEarlyAccessArticleById = async (id: string, token: string) => {
	return await apiDelete<ApiResponse<null>>({
		token,
		path: `${PATH}/${id}`
	});
};

/**
 * Api upload early access article file
 * @param params UploadFileQueryParams
 * @param body BodyInit
 * @param token string
 * @returns ApiResponse<UploadFile>
 */
export const apiUploadEarlyAccessArticleFile = async (
	params: UploadFileQueryParams,
	body: BodyInit,
	token: string
) => {
	return await apiPostFile<ApiResponse<UploadFile>>({
		path: `${PATH}/upload-file`,
		params,
		body,
		token
	});
};

/**
 * Api delete early access article file
 * @param filePath string
 * @param token string
 * @returns ApiResponse<null>
 */
export const apiDeleteEarlyAccessArticleFile = async (filePath: string, token: string) => {
	return await apiDelete<ApiResponse<null>>({
		path: `${PATH}/delete-file`,
		params: { filePath },
		token
	});
};
