import type { ApiResponse } from "@type/api/api.type";
import type { Article, ArticleBody, ArticleQueryParams } from "@type/api/article.type";
import { apiGet, apiPut } from "@utils/api";

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
 * @param id number
 * @returns ApiResponse<Article>
 */
export const apiGetArticleById = async (id: number) => {
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
