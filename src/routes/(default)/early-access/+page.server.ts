import { apiGetEarlyAccessArticles } from "@api/early_access_article.api";
import type { EarlyAccessArticle } from "@type/api/early_access_article.type";
import type { PageServerLoad } from "./$types";
import type { Article } from "@type/api/article.type";

export const load: PageServerLoad = async () => {
	let articles: Article[] = [];

	try {
		const response = await apiGetEarlyAccessArticles({});
		articles = response.data.map((item) => {
			return {
				authors: item.authors,
				id: item.id,
				pdf_path: item.pdf_path,
				title: item.title,

				// early access article does not have these fields, so we set default values
				doi: "",
				views: 0,
				category: "",
				abstract: "",
				created_at: item.created_at,
				updated_at: item.updated_at,
				created_by: item.created_by,
				updated_by: item.updated_by,
				history: [],
				issue: -1,
				volume: -1,
				year: -1,
				pages: {
					first: -1,
					last: -1
				},
				language: "",
				pub_date: {
					year: -1,
					month: -1,
					day: -1
				},
				citations: {
					apa: "",
					bib_tex: ""
				}
			};
		});
		// articles = response.data ?? [];

		return { articles };
	} catch (error) {
		console.log(error);
	}

	return { articles };
};
