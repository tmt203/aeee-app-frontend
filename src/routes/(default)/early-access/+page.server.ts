import type { Article } from "@type/api/article.type";
import type { PageServerLoad } from "./$types";
import { apiGetEarlyAccessArticles } from "@api/early_access_article.api";

export const load: PageServerLoad = async () => {
	let articles: Article[] = [];

	try {
		const response = await apiGetEarlyAccessArticles({});
		articles = response.data ?? [];

		return { articles };
	} catch (error) {
		console.log(error);
	}

	return { articles };
};
