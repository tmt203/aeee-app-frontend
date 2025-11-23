import type { ApiResponse } from "@type/api/api.type";
import type {
	Article,
	ArticleBody,
	ArticleQueryParams,
	UploadFile,
	UploadFileQueryParams
} from "@type/api/article.type";
import { apiDelete, apiGet, apiPatch, apiPost, apiPostFile, apiPut } from "@utils/api";

const PATH = "/api/v1/articles";

/**
 * Api get articles
 * @param params ArticleQueryParams
 * @returns ApiResponse<Article[]>
 */
export const apiGetArticles = async (params: ArticleQueryParams) => {
	return await apiGet<ApiResponse<Article[]>>({
		path: `${PATH}`,
		token: "AUTH_TOKEN",
		params
	});
};

/**
 * Api get article by id
 * @param id string
 * @returns ApiResponse<Article>
 */
export const apiGetArticleById = async (id: string) => {
	return await apiGet<ApiResponse<Article>>({
		path: `${PATH}/${id}`,
		token: "AUTH_TOKEN"
	});
};

/**
 * Api get latest article
 * @returns ApiResponse<Article>
 */
export const apiGetLatestArticle = async () => {
	return await apiGet<ApiResponse<Article>>({
		path: `${PATH}/latest`,
		token: "AUTH_TOKEN"
	});
};

/**
 * Api post article
 * @param body ArticleBody
 * @param token string
 * @returns ApiResponse<Article>
 */
export const apiPostArticle = async (body: ArticleBody, token: string) => {
	return await apiPost<ApiResponse<Article>>({
		token,
		path: `${PATH}`,
		body: JSON.stringify(body)
	});
};

/**
 * Api put article by id
 * @param id string
 * @param body ArticleBody
 * @returns ApiResponse<Article>
 */
export const apiPutArticleById = async (id: string, body: ArticleBody, token: string) => {
	return await apiPut<ApiResponse<Article>>({
		token,
		path: `${PATH}/${id}`,
		body: JSON.stringify(body)
	});
};

/**
 * Api patch article by id
 * @param id string
 * @param body Partial<ArticleBody>
 * @param token string
 * @returns ApiResponse<Article>
 */
export const apiPatchArticleById = async (
	id: string,
	body: Partial<ArticleBody>,
	token: string
) => {
	return await apiPatch<ApiResponse<Article>>({
		token,
		path: `${PATH}/${id}`,
		body: JSON.stringify(body)
	});
};

/**
 * Api delete article by id
 * @param id string
 * @param token string
 * @returns ApiResponse<null>
 */
export const apiDeleteArticleById = async (id: string, token: string) => {
	return await apiDelete<ApiResponse<null>>({
		token,
		path: `${PATH}/${id}`
	});
};

/**
 * Api upload article file
 * @param params UploadFileQueryParams
 * @param body BodyInit
 * @param token string
 * @returns ApiResponse<UploadFile>
 */
export const apiUploadArticleFile = async (
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
 * Api delete article file
 * @param filePath string
 * @param token string
 * @returns ApiResponse<null>
 */
export const apiDeleteArticleFile = async (filePath: string, token: string) => {
	return await apiDelete<ApiResponse<null>>({
		path: `${PATH}/delete-file`,
		params: { filePath },
		token
	});
};
