import { apiGetArticles } from "@api/article.api";
import type { Article } from "@type/api/article.type";
import type { PageServerLoad } from "./$types";
import type { Manager } from "@type/api/manager.type";

export const load: PageServerLoad = async ({ locals }) => {
	let latestManager: Manager | null = null;
	let mostViewsArticles: Article[] = [];
	let previousArticles: Article[] = [];
	let incomingArticles: Article[] = [];

	try {
		// Make API calls concurrently
		const [mostViewsResponse, previousResponse, incomingResponse] = await Promise.all([
			apiGetArticles({ limit: 20, sort: "-views" }),
			apiGetArticles({ limit: 9999, year: new Date().getFullYear() - 1 }), // Previous year
			apiGetArticles({ limit: 9999, year: new Date().getFullYear() })
		]);

		if (
			mostViewsResponse.code !== "OK" ||
			previousResponse.code !== "OK" ||
			incomingResponse.code !== "OK"
		) {
			throw new Error("Failed to fetch articles");
		}

		mostViewsArticles = mostViewsResponse.data || [];
		previousArticles = previousResponse.data || [];
		incomingArticles = incomingResponse.data || [];

		return { mostViewsArticles, previousArticles, incomingArticles };
	} catch (error) {
		console.log(error);
	}

	return { mostViewsArticles, previousArticles, incomingArticles };
};
