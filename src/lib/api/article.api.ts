import type { ApiResponse } from "@type/api/api.type";
import type { Article, ArticleQueryParams } from "@type/api/article.type";
import { apiGet } from "@utils/api";

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
